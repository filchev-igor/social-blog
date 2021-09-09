import Input from "../layout/input";
import React, {useState} from "react";
import {useSession, useUserPostsId} from "../../hooks";
import {firebaseAuthErrorData} from "../../constants/firebaseErrors";
import { doc, deleteDoc } from "firebase/firestore";
import {firebaseDb} from "../../Firebase";
import {getAuth, deleteUser, reauthenticateWithCredential, EmailAuthProvider} from "firebase/auth";

const ERASE_ACCOUNT = "Do you wish to delete your account? It will be impossible to restore it";
const DELETE_ACCOUNT = "Are you still sure?";

const DeleteAccount = () => {
    const user = useSession();

    const [currentPassword, setCurrentPassword] = useState('');
    const [hasLaunchedDeleting, setHasLaunchedDeleting] = useState(false);
    const [firebaseAuthError, setFirebaseAuthError] = useState(firebaseAuthErrorData);

    const userPostsId = useUserPostsId(user.uid);

    const handleConfirmErase = e => {
        e.preventDefault();

        if (!window.confirm(ERASE_ACCOUNT))
            return false;

        setHasLaunchedDeleting(true);
    };

    const handleDeleteAccount = e => {
        e.preventDefault();

        if (!window.confirm(DELETE_ACCOUNT))
            return false;

        const auth = getAuth();

        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);

        reauthenticateWithCredential(auth.currentUser, credential)
            .then(async () => {
                for (const id of userPostsId)
                    await deleteDoc(doc(firebaseDb, "posts", id));

                await deleteDoc(doc(firebaseDb, "users", user.uid));

                deleteUser(auth.currentUser).then();
            })
            .catch(error => setFirebaseAuthError(error));
    };

    if (!hasLaunchedDeleting) {
        return <button
            type="button"
            className="btn btn-outline-warning"
            onClick={handleConfirmErase}>
            Delete account
        </button>;
    }

    return <>
        {firebaseAuthError.code &&
        <div className="alert alert-danger mt-3" role="alert">{firebaseAuthError.message}</div>}

        <Input
            type="password"
            id="currentPassword"
            value={currentPassword}
            placeholder="Type current password"
            onChange={setCurrentPassword}/>

        <button
            type="button"
            className="btn btn-danger mt-3"
            onClick={handleDeleteAccount}>Delete and confirm</button>
    </>;
};

export default DeleteAccount;