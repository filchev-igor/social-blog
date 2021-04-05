import React, {useContext, useState} from "react";
import firebaseAuth from "../../Firebase";
import firebase from "firebase";
import {LabeledInput} from "../globalLayout";
import {AuthUserContext} from "../../contexts";
import firebaseErrorData from "../../constants/firebaseError";

const AccountSettings = () => {
    const authUser = useContext(AuthUserContext);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
    const [firebaseError, setFirebaseError] = useState(firebaseErrorData);
    const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);

    const isInvalid =
        currentPassword === '' ||
        newPassword !== newPasswordRepeat ||
        newPassword === '';

    const handlePasswordUpdate = e => {
        const confirmText = "Click yes to change your password";

        if (!window.confirm(confirmText))
            return false;

        const user = firebaseAuth.currentUser;

        const credential = firebase.auth.EmailAuthProvider.credential(authUser.email, currentPassword);

        user.reauthenticateWithCredential(credential)
            .then(() => {
                user.updatePassword(newPassword)
                    .then(() => {
                        setCurrentPassword('');
                        setNewPassword('');
                        setNewPasswordRepeat('');
                        setFirebaseError(firebaseErrorData);
                        setIsPasswordUpdated(true);
                    })
                    .catch(error => {
                        if (isPasswordUpdated)
                            setIsPasswordUpdated(false);

                        setFirebaseError(error);
                    })
            })
            .catch(error => {
                if (isPasswordUpdated)
                    setIsPasswordUpdated(false);

                setFirebaseError(error);
            })

        e.preventDefault();
    };

    return <>
        <LabeledInput type="password" id="currentPassword" value={currentPassword} placeholder="Type current password" onChange={setCurrentPassword}/>

        <LabeledInput type="password" id="newPassword" value={newPassword} placeholder="Type new password" onChange={setNewPassword}/>

        <LabeledInput type="password" id="newPasswordRepeat" value={newPasswordRepeat} placeholder="Type new password again" onChange={setNewPasswordRepeat}/>

        {firebaseError.code &&
        <div className="alert alert-danger mt-3" role="alert">{firebaseError.message}</div>}

        {isPasswordUpdated &&
        <div className="alert alert-success mt-3" role="alert">Password updated</div>}

        <button type="button" disabled={isInvalid} className="btn btn-info mt-3" onClick={handlePasswordUpdate}>Change password</button>
    </>;
};

export default AccountSettings;