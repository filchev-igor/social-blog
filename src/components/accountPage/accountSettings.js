import React, {useContext, useState} from "react";
import firebase from "firebase";
import {AuthUserContext} from "../../contexts";
import {firebaseAuth} from "../../Firebase";
import {firebaseAuthErrorData} from "../../constants/firebaseErrors";
import InputReadonly from "../layout/inputReadonly";

const CONFIRM_TEXT = "Do you wish to update your account?";

const AccountSettings = () => {
    const authUser = useContext(AuthUserContext);

    const [email, setEmail] = useState(authUser.email);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
    const [firebaseAuthError, setFirebaseAuthError] = useState(firebaseAuthErrorData);
    const [isEmailUpdated, setIsEmailUpdated] = useState(false);
    const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
    const [fieldToUpdate, setFieldToUpdate] = useState(null);

    const handleFieldForUpdate = type => setFieldToUpdate(type);

    const handleAccountUpdate = e => {
        e.preventDefault();

        if (fieldToUpdate === "email")
            handleEmailUpdate();
        else if (fieldToUpdate === "password")
            handlePasswordUpdate();
    };

    const handleEmailUpdate = () => {
        if (!window.confirm(CONFIRM_TEXT))
            return false;

        const user = firebaseAuth.currentUser;

        const credential = firebase.auth.EmailAuthProvider.credential(authUser.email, currentPassword);

        user.reauthenticateWithCredential(credential)
            .then(() => {
                user.sendEmailVerification()
                    .then(() => {
                        setEmail(firebaseAuth.currentUser.email);
                        setCurrentPassword('');
                        setNewPassword('');
                        setNewPasswordRepeat('');
                        setFirebaseAuthError(firebaseAuthErrorData);
                        setIsEmailUpdated(true);
                        setIsPasswordUpdated(false);
                        setFieldToUpdate(null);
                    })
                    .catch(error => {
                        if (isPasswordUpdated)
                            setIsPasswordUpdated(false);

                        setFirebaseAuthError(error);
                    });
            })
            .catch(error => {
                if (isPasswordUpdated)
                    setIsPasswordUpdated(false);

                setFirebaseAuthError(error);
            });
    };

    const handlePasswordUpdate = () => {
        if (!window.confirm(CONFIRM_TEXT))
            return false;

        const user = firebaseAuth.currentUser;

        const credential = firebase.auth.EmailAuthProvider.credential(authUser.email, currentPassword);

        user.reauthenticateWithCredential(credential)
            .then(() => {
                user.updatePassword(newPassword)
                    .then(() => {
                        setEmail(firebaseAuth.currentUser.email);
                        setCurrentPassword('');
                        setNewPassword('');
                        setNewPasswordRepeat('');
                        setFirebaseAuthError(firebaseAuthErrorData);
                        setIsEmailUpdated(false);
                        setIsPasswordUpdated(true);
                        setFieldToUpdate(null);
                    })
                    .catch(error => {
                        if (isPasswordUpdated)
                            setIsPasswordUpdated(false);

                            setFirebaseAuthError(error);
                    });
            })
            .catch(error => {
                if (isPasswordUpdated)
                    setIsPasswordUpdated(false);

                setFirebaseAuthError(error);
            });
    };

    return <>
        <InputReadonly type="email" id="currentEmail" value={email} placeholder="Type new email" onChange={setEmail} onClick={handleFieldForUpdate} readonly={fieldToUpdate !== "email"}/>

        <InputReadonly type="password" id="currentPassword" value={currentPassword} placeholder="Type current password" onChange={setCurrentPassword} onClick={handleFieldForUpdate} readonly={fieldToUpdate !== "password"}/>

        <InputReadonly type="password" id="newPassword" value={newPassword} placeholder="Type new password" onChange={setNewPassword} onClick={handleFieldForUpdate} readonly={fieldToUpdate !== "password"}/>

        <InputReadonly type="password" id="newPasswordRepeat" value={newPasswordRepeat} placeholder="Type new password again" onChange={setNewPasswordRepeat} onClick={handleFieldForUpdate} readonly={fieldToUpdate !== "password"}/>

        {firebaseAuthError.code &&
        <div className="alert alert-danger mt-3" role="alert">{firebaseAuthError.message}</div>}

        {(isEmailUpdated || isPasswordUpdated) &&
        <div className="alert alert-success mt-3" role="alert">{fieldToUpdate[0].toUpperCase() + fieldToUpdate.slice(1)} was updated!</div>}

        <button type="button" className="btn btn-info mt-3" onClick={handleAccountUpdate}>Change password</button>
    </>;
};

export default AccountSettings;