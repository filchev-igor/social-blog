import React, {useEffect, useRef, useState} from "react";
import Input from "../layout/input";
import {useFullUserData, useSession, useUserCommentsId, useUserPostsId} from "../../hooks";
import { doc, updateDoc } from "firebase/firestore";
import {firebaseDb} from "../../Firebase";

const UPDATE_ACCOUNT = "Do you wish to update your account?";

const UserData = () => {
    const user = useSession();

    const {isLoadingUserCollection, userCollection} = useFullUserData();

    const userPostsId = useUserPostsId(user.uid);
    const userCommentsId = useUserCommentsId(user.uid);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isNameUpdated, setIsNameUpdated] = useState(false);

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

        (async() => {
            const usersData = {
                name: {
                    first: firstName,
                    last: lastName
                }
            };

            const postsData = {
                "creator.first": firstName,
                "creator.last": lastName
            }

            const commentsData = {
                "commentator.first": firstName,
                "commentator.last": lastName
            }

            const usersRef = doc(firebaseDb, "users", user.uid);

            await updateDoc(usersRef, usersData);

            for (const id of userPostsId) {
                const postsRef = doc(firebaseDb, "posts", id);

                await updateDoc(postsRef, postsData);
            }

            for (const id of userCommentsId) {
                const commentsRef = doc(firebaseDb, "comments", id);

                await updateDoc(commentsRef, commentsData);
            }
        })().then(() => setIsNameUpdated(true));
    };
    
    useEffect(() => {
        if (isLoadingUserCollection)
            return;

        setFirstName(nameRef.current.first);
        setLastName(nameRef.current.last);
    }, [isLoadingUserCollection]);

    return <>
        <Input value={firstName} placeholder="Type your first name" onChange={setFirstName}/>

        <Input value={lastName} placeholder="Type your last name" onChange={setLastName}/>

        <button type="button" className="btn btn-info mt-3" onClick={handleUserDataUpdate}>Update your data</button>

        {isNameUpdated &&
        <div className="alert alert-success mt-3" role="alert">Your name was updated!</div>}
    </>;
};

export default UserData;