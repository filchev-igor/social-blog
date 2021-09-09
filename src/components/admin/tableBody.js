import React from "react";
import {useAllUsersCollection} from "../../hooks";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import {firebaseAuthErrorData} from "../../constants/firebaseErrors";

const TableBody = ({email, setFirebaseAuthError}) => {
    const usersData = useAllUsersCollection();

    const handleResetPassword = () => {
        const auth = getAuth();

        sendPasswordResetEmail(auth, email)
            .then(() => setFirebaseAuthError(firebaseAuthErrorData))
            .catch(error => setFirebaseAuthError(error));
    };

    const rows = usersData.map((element, index) => {
        return (
            <tr key={`users-table-${index}`}>
                <th scope="row">{index + 1}</th>
                <th scope="row">{email}</th>
                <th scope="row">{element.name.first}</th>
                <th scope="row">{element.name.last}</th>
                <th scope="row">{element.publishedPosts}</th>
                <th scope="row">{element.hasDraft ? "Yes" : "No"}</th>
                <th scope="row">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleResetPassword}>
                        Reset password
                    </button>
                </th>
            </tr>
        )
    });

    return (
        <tbody>{rows}</tbody>
    )
};

export default TableBody;