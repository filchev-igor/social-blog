import React, {useContext, useState} from "react";
import firebase from "firebase";
import {AuthUserContext} from "../../contexts";
import {firebaseAuth} from "../../Firebase";
import {firebaseAuthErrorData} from "../../constants/firebaseErrors";
import Input from "../layout/input";

const CONFIRM_TEXT = "Do you wish to update your account?";

const AccountSettings = () => {
    const authUser = useContext(AuthUserContext);

    const [email, setEmail] = useState(authUser.email);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
    const [firebaseAuthError, setFirebaseAuthError] = useState(firebaseAuthErrorData);
    const [isCredentialUpdated, setIsCredentialUpdated] = useState(false);
    const [fieldToUpdate, setFieldToUpdate] = useState('email');

    const handleEmailUpdate = e => {
        e.preventDefault();

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
                        setIsCredentialUpdated(true);
                    })
                    .catch(error => setFirebaseAuthError(error));
            })
            .catch(error => setFirebaseAuthError(error));
    };

    const handlePasswordUpdate = e => {
        e.preventDefault();

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
                        setIsCredentialUpdated(true);
                        setFieldToUpdate(null);
                    })
                    .catch(error => setFirebaseAuthError(error));
            })
            .catch(error => setFirebaseAuthError(error));
    };

    return <>
        <button type="button" className={`btn btn-outline-primary${(fieldToUpdate === 'email') ? ' active' : ''}`} onClick={() => setFieldToUpdate('email')}>E-mail</button>
        <button type="button" className={`btn btn-outline-primary${(fieldToUpdate === 'password') ? ' active' : ''}`} onClick={() => setFieldToUpdate('password')}>Password</button>

        {fieldToUpdate === "email" &&
        <Input type="email" id="currentEmail" value={email} placeholder="Type new email" onChange={setEmail}/>
        }

        <Input type="password" id="currentPassword" value={currentPassword} placeholder="Type current password" onChange={setCurrentPassword} />

        {fieldToUpdate === "password" &&
        <Input type="password" id="newPassword" value={newPassword} placeholder="Type new password"
               onChange={setNewPassword}/>
        }

        {fieldToUpdate === "password" &&
        <Input type="password" id="newPasswordRepeat" value={newPasswordRepeat} placeholder="Type new password again" onChange={setNewPasswordRepeat} />
        }

        {firebaseAuthError.code &&
        <div className="alert alert-danger mt-3" role="alert">{firebaseAuthError.message}</div>}

        {isCredentialUpdated && !firebaseAuthError.code &&
        <div className="alert alert-success mt-3" role="alert">{fieldToUpdate[0].toUpperCase() + fieldToUpdate.slice(1)} was updated!</div>}

        <button type="button" className="btn btn-info mt-3" onClick={(fieldToUpdate === "email") ? handleEmailUpdate : handlePasswordUpdate}>Change {fieldToUpdate}</button>
    </>;
};

export default AccountSettings;