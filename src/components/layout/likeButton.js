import React, {useEffect, useState} from "react";
import {arrayRemove, arrayUnion, doc, updateDoc} from "firebase/firestore";
import {firebaseDb} from "../../Firebase";
import {useFullUserData, useSession} from "../../hooks";

const LikeButton = props => {
    const user = useSession();

    const {
        positivelyLiked,
        negativelyLiked,
        rating,
        docId,
        isRatingBeingManipulated,
        setIsRatingBeingManipulated,
        collectionName
    } = props;

    const {isLoadingUserCollection, userCollection} = useFullUserData();

    const isLiked = positivelyLiked.includes(user.uid);
    const isDisliked = negativelyLiked.includes(user.uid);

    const [isPressed, setIsPressed] = useState(isLiked);
    const [isHovered, setIsHovered] = useState(false);
    const [color, setColor] = useState("success");
    const [iconName, setIconName] = useState("hand-thumbs");

    const handleRating = () => {
        if (isRatingBeingManipulated)
            return;

        (async () => {
            setIsRatingBeingManipulated(true);

            const newRating = isDisliked ?
                rating + 2 :
                !isPressed ?
                    rating + 1 :
                    rating - 1;

            const docData = {
                "rating": newRating,
                "likedBy.positively": !isPressed ? arrayUnion(user.uid) : arrayRemove(user.uid),
                "likedBy.negatively": arrayRemove(user.uid)
            };

            const docRef = doc(firebaseDb, collectionName, docId);

            await updateDoc(docRef, docData);
        })().then(() => {
            setIsPressed(!isPressed);
            setIsRatingBeingManipulated(false);
        });
    };

    const handleButtonHover = () => {
        if (!isPressed)
            setIsHovered(true);
    };

    const handleButtonRelease = () => {
        if (!isPressed)
            setIsHovered(false);
    }

    useEffect(() => {
        if (isDisliked)
            setIsPressed(false);
    }, [isDisliked]);

    useEffect(() => {
        if (!isLoadingUserCollection) {
            const icon = userCollection['interfaceStyles']['likeButtons']['like']['icon'];
            const background = userCollection['interfaceStyles']['likeButtons']['like']['background'];

            setIconName(icon);
            setColor(background);
        }
    }, [isLoadingUserCollection, userCollection]);

    const hoveredStyle = (isHovered &&
        (iconName === "hand-thumbs" || iconName === "caret")) ? "-fill" : "";

    return (
        <button
            type="button"
            className={`btn btn-${isPressed ? "" : "outline-"}${color}`}
            onClick={handleRating}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonRelease}>
            <i className={`bi bi-${iconName}-up${hoveredStyle}`}>

            </i>
        </button>
    );
};

export default LikeButton;