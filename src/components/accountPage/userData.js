import React, {useContext, useEffect, useRef, useState} from "react";
import Input from "../layout/input";
import {useSession, useUserCollection} from "../../hooks";
import { doc, updateDoc } from "firebase/firestore";
import {firebaseDb} from "../../Firebase";
import {IsInitializingContext} from "../../contexts";

const UPDATE_ACCOUNT = "Do you wish to update your account?";

const UserData = () => {
    const isInitializing = useContext(IsInitializingContext);
    const user = useSession();

    const {isLoadingUserCollection, userCollection} = useUserCollection(isInitializing ? "" : user.uid);

    //TODO mistake in authUser.name update. In some cases it can not be loaded

    const [firstName, setFirstName] = useState(isLoadingUserCollection ? "" : userCollection.name.first);
    const [lastName, setLastName] = useState(isLoadingUserCollection ? "" : userCollection.name.last);
    const [isNameUpdated, setIsNameUpdated] = useState(false);
    const [firestoreError, setFirestoreError] = useState(null);

    const nameRef = useRef({
        first: "",
        last: ""
    });

    nameRef.current = {
        first: isLoadingUserCollection ? "" : userCollection.name.first,
        last: isLoadingUserCollection ? "" : userCollection.name.last
    };
    const handleUserDataUpdate = e => {
        e.preventDefault();

        if (!window.confirm(UPDATE_ACCOUNT))
            return;

        const updateUserCollection = async() => {
            const docRef = doc(firebaseDb, "users", user.uid);

            try {
                await updateDoc(docRef, {
                    name: {
                        first: firstName,
                        last: lastName
                    }
                });
            }
            catch(error) {
                setIsNameUpdated(false);
                setFirestoreError(error);
            }
        };

        updateUserCollection()
            .then(() => {
                setFirestoreError(null);
                setIsNameUpdated(true);
            });
    };
    
    useEffect(() => {
        if (!isLoadingUserCollection) {
            setFirstName(nameRef.current.first);
            setLastName(nameRef.current.last);
        }
    }, [isLoadingUserCollection]);

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