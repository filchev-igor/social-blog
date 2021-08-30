import React, {useContext, useState} from "react";
import {AuthUserContext} from "../../contexts";
import Input from "../layout/input";
import {firebaseFirestore} from "../../Firebase";

const CONFIRM_TEXT = "Do you wish to update your account?";

const UserData = () => {
    const authUser = useContext(AuthUserContext);

    //TODO mistake in authUser.name update. In some cases it can not be loaded

    const [firstName, setFirstName] = useState(authUser.name !== undefined ? authUser.name.first : "");
    const [lastName, setLastName] = useState(authUser.name !== undefined ? authUser.name.last : "");
    const [isNameUpdated, setIsNameUpdated] = useState(false);
    const [firestoreError, setFirestoreError] = useState(null);

    const handleUserDataUpdate = e => {
        e.preventDefault();

        if (!window.confirm(CONFIRM_TEXT))
            return false;

        firebaseFirestore.collection("users").doc(authUser.uid)
            .update({
                name: {
                    first: firstName,
                    last: lastName
                }
            })
            .then(() => {
                setFirestoreError(null);
                setIsNameUpdated(true);
            })
            .catch(error => {
                setIsNameUpdated(false);
                setFirestoreError(error);
            })
    };

    return <>
        <Input id="firstName" value={firstName} placeholder="Type your first name" onChange={setFirstName}/>

        <Input id="lastName" value={lastName} placeholder="Type your last name" onChange={setLastName}/>

        <button type="button" className="btn btn-info mt-3" onClick={handleUserDataUpdate}>Update your data</button>

        {firestoreError && firestoreError.code &&
        <div className="alert alert-danger mt-3" role="alert">{firestoreError.message}</div>}

        {isNameUpdated &&
        <div className="alert alert-success mt-3" role="alert">Your name was updated!</div>}
    </>;
};

export default UserData;