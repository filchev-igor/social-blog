import React, {useEffect, useState} from "react";
import {arrayRemove, arrayUnion, doc, updateDoc} from "firebase/firestore";
import {firebaseDb} from "../../Firebase";
import {useSession} from "../../hooks";

const LikeButton = props => {
    const user = useSession();

    const {
        positivelyLiked,
        negativelyLiked,
        rating,
        postId,
        isRatingBeingManipulated,
        setIsRatingBeingManipulated
    } = props;

    const isLiked = positivelyLiked.includes(user.uid);
    const isDisliked = negativelyLiked.includes(user.uid);

    const [isPressed, setIsPressed] = useState(isLiked);
    const [isHovered, setIsHovered] = useState(false);

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

            const docRef = doc(firebaseDb, "posts", postId);

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
        setIsPressed(false);
    }, [isDisliked]);

    return (
        <button
            type="button"
            className={`btn btn-${isPressed ? "" : "outline-"}success`}
            onClick={handleRating}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonRelease}>
            <i className={`bi bi-hand-thumbs-up${isHovered ? "-fill" : ""}`}>

            </i>
        </button>
    );
};

export default LikeButton;