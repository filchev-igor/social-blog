import React, {useState} from "react";
import {firebaseAuthErrorData} from "../../constants/firebaseErrors";
import Input from "../layout/input";
import {useSession} from "../../hooks";
import { getAuth, reauthenticateWithCredential, sendEmailVerification, updatePassword, EmailAuthProvider } from "firebase/auth";

const CONFIRM_TEXT = "Do you wish to update your account?";

const AccountSettings = () => {
    const user = useSession();

    const [email, setEmail] = useState(user.email);
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

        const auth = getAuth();

        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);

        reauthenticateWithCredential(auth.currentUser, credential)
            .then(() => {
                sendEmailVerification(auth.currentUser)
                    .then(() => {
                        setEmail(auth.currentUser.email);
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

        const auth = getAuth();

        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);

        reauthenticateWithCredential(auth.currentUser, credential)
            .then(() => {
                updatePassword(auth.currentUser, newPassword)
                    .then(() => {
                        setEmail(auth.currentUser.email);
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
        <div className="btn-group mb-3" role="group">
            <button type="button" className={`btn btn-outline-primary${(fieldToUpdate === 'email') ? ' active' : ''}`} onClick={() => setFieldToUpdate('email')}>E-mail</button>
            <button type="button" className={`btn btn-outline-primary${(fieldToUpdate === 'password') ? ' active' : ''}`} onClick={() => setFieldToUpdate('password')}>Password</button>
        </div>

        {fieldToUpdate === "email" &&
        <Input type="email" value={email} placeholder="Type new email" onChange={setEmail}/>
        }

        <Input type="password" value={currentPassword} placeholder="Type current password" onChange={setCurrentPassword} />

        {fieldToUpdate === "password" &&
        <Input type="password" value={newPassword} placeholder="Type new password"
               onChange={setNewPassword}/>
        }

        {fieldToUpdate === "password" &&
        <Input type="password" value={newPasswordRepeat} placeholder="Type new password again" onChange={setNewPasswordRepeat} />
        }

        {firebaseAuthError.code &&
        <div className="alert alert-danger mt-3" role="alert">{firebaseAuthError.message}</div>}

        {isCredentialUpdated && !firebaseAuthError.code &&
        <div className="alert alert-success mt-3" role="alert">{fieldToUpdate[0].toUpperCase() + fieldToUpdate.slice(1)} was updated!</div>}

        <button type="button" className="btn btn-info mt-3" onClick={(fieldToUpdate === "email") ? handleEmailUpdate : handlePasswordUpdate}>Change {fieldToUpdate}</button>
    </>;
};

export default AccountSettings;