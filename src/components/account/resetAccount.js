import Input from "../layout/input";
import React, {useState} from "react";
import {useSession, useUserCommentsId, useUserPostsId} from "../../hooks";
import {firebaseAuthErrorData} from "../../constants/firebase";
import {doc, deleteDoc, updateDoc} from "firebase/firestore";
import {firebaseDb} from "../../Firebase";
import {getAuth, deleteUser, reauthenticateWithCredential, EmailAuthProvider} from "firebase/auth";
import {DELETE_ACCOUNT, ERASE_ACCOUNT, RESET_COLORS} from "../../constants/account";
import {DEFAULT_STYLES} from "../../constants/interfaceStyles";

const ResetAccount = () => {
    const user = useSession();

    const [currentPassword, setCurrentPassword] = useState('');
    const [hasLaunchedDeleting, setHasLaunchedDeleting] = useState(false);
    const [firebaseAuthError, setFirebaseAuthError] = useState(firebaseAuthErrorData);
    const [hasResetStyles, setHasResetStyles] = useState(false);

    const userPostsId = useUserPostsId(user.uid);
    const userCommentsId = useUserCommentsId(user.uid);

    const handleConfirmErase = e => {
        e.preventDefault();

        setHasResetStyles(true);

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

                for (const id of userCommentsId)
                    await deleteDoc(doc(firebaseDb, "comments", id));

                await deleteDoc(doc(firebaseDb, "users", user.uid));

                deleteUser(auth.currentUser).then();
            })
            .catch(error => setFirebaseAuthError(error));
    };

    const handleResetColors = async() => {
        if (!window.confirm(RESET_COLORS))
            return false;

        const usersData = {
            interfaceStyles: DEFAULT_STYLES
        };

        const usersRef = doc(firebaseDb, "users", user.uid);

        await updateDoc(usersRef, usersData);

        setHasResetStyles(true);
    };

    if (!hasLaunchedDeleting) {
        return (
            <>
                <div className="d-md-flex gap-3 d-grid mb-3">
                    <button
                        type="button"
                        className="btn btn-outline-warning"
                        onClick={handleResetColors}>
                        Set colors and styles to the default values
                    </button>

                    <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={handleConfirmErase}>
                        Delete account
                    </button>
                </div>

                {hasResetStyles &&
                <div className="alert alert-success" role="alert">
                    All elements now have the default values.
                </div>}
            </>
        );
    }

    return <>
        {firebaseAuthError.code &&
        <div className="alert alert-danger mt-3" role="alert">{firebaseAuthError.message}</div>}

        <Input
            type="password"
            value={currentPassword}
            placeholder="Type current password"
            onChange={setCurrentPassword}/>

        <button
            type="button"
            className="btn btn-danger mt-3"
            onClick={handleDeleteAccount}>Delete and confirm</button>
    </>;
};

export default ResetAccount;