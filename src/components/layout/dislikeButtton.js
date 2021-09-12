import React, {useEffect, useState} from "react";
import {arrayRemove, arrayUnion, doc, updateDoc} from "firebase/firestore";
import {firebaseDb} from "../../Firebase";
import {useSession} from "../../hooks";

const DislikeButton = props => {
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

    const isLiked = positivelyLiked.includes(user.uid);
    const isDisliked = negativelyLiked.includes(user.uid);

    const [isPressed, setIsPressed] = useState(isDisliked);
    const [isHovered, setIsHovered] = useState(false);

    const handleRating = () => {
        if (isRatingBeingManipulated)
            return;

        (async () => {
            setIsRatingBeingManipulated(true);

            const newRating = isLiked ?
                rating - 2 :
                !isPressed ?
                    rating - 1 :
                    rating + 1;

            const docData = {
                "rating": newRating,
                "likedBy.negatively": isPressed ? arrayRemove(user.uid) : arrayUnion(user.uid),
                "likedBy.positively": arrayRemove(user.uid)
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
        if (isLiked)
            setIsPressed(false);
    }, [isLiked]);

    return (
        <button
            type="button"
            className={`btn btn-${isPressed ? "" : "outline-"}danger`}
            onClick={handleRating}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonRelease}>
            <i className={`bi bi-hand-thumbs-down${isHovered ? "-fill" : ""}`}>

            </i>
        </button>
    );
};

export default DislikeButton;