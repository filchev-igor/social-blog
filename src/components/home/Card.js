import React, {useState} from "react";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import {firebaseDb} from "../../Firebase";
import {useSession} from "../../hooks";

const Card = props => {
    const {
        postStructure,
        data,
        postId
    } = props;

    const user = useSession();

    const positivelyLiked = data.likedBy.positively;
    const negativelyLiked = data.likedBy.negatively;

    const [isLiked, setIsLiked] = useState(positivelyLiked.includes(user.uid));
    const [isDisliked, setIsDisliked] = useState(negativelyLiked.includes(user.uid));
    const [isLikeHovered, setIsLikeHovered] = useState(false);
    const [isDislikeHovered, setIsDislikeHovered] = useState(false);

    const firstName = data.creator.first;
    const lastName = data.creator.last;
    const date = data.dates.published;
    const title = data.title;
    const rating = data.rating;

    const handleEvaluatedPositively = (isUserRecallingMark = false) => {
        (async () => {
            const newRating = negativelyLiked.includes(user.uid) && !isUserRecallingMark ? 2 : 1;

            const docData = {
                "rating": rating + newRating,
                "likedBy.positively": !isUserRecallingMark ? arrayUnion(user.uid) : arrayUnion(),
                "likedBy.negatively": arrayRemove(user.uid)
            };

            const docRef = doc(firebaseDb, "posts", postId);

            await updateDoc(docRef, docData);
        })().then(() => {
            setIsLiked(!isUserRecallingMark);
            setIsDisliked(false);
        });
    };

    const handleEvaluatedNegatively = (isUserRecallingMark = false) => {
        (async () => {
            const newRating = positivelyLiked.includes(user.uid) && !isUserRecallingMark ? 2 : 1;

            const docData = {
                "rating": rating - newRating,
                "likedBy.positively": arrayRemove(user.uid),
                "likedBy.negatively": !isUserRecallingMark ? arrayUnion(user.uid) : arrayUnion()
            };

            const docRef = doc(firebaseDb, "posts", postId);

            await updateDoc(docRef, docData);
        })().then(() => {
            setIsLiked(false);
            setIsDisliked(!isUserRecallingMark);
        });
    };

    return (
        <div className="card">
            <div className="card-header">
                {`${firstName} ${lastName} ${date}`}
            </div>

            <div className="card-body">
                <h5 className="card-title">{title}</h5>

                {postStructure}
            </div>

            <div className="card-footer">
                <button
                    type="button"
                    className={`btn ${isLiked ? "btn-success" : "btn-outline-success"}`}
                    onClick={!isLiked ? () => handleEvaluatedPositively(): () => handleEvaluatedNegatively(true)}
                    onMouseEnter={!isLiked ? () => setIsLikeHovered(true) : () => {}}
                    onMouseLeave={!isLiked ? () => setIsLikeHovered(false) : () => {}}>
                    <i className={`bi bi-hand-thumbs-up${isLikeHovered ? "-fill" : ""}`}>

                    </i>
                </button>

                <span>{rating}</span>

                <button
                    type="button"
                    className={`btn ${isDisliked ? "btn-danger" : "btn-outline-danger"}`}
                    onClick={!isDisliked ? () => handleEvaluatedNegatively() : () => handleEvaluatedPositively(true)}
                    onMouseEnter={!isDisliked ? () => setIsDislikeHovered(true) : () => {}}
                    onMouseLeave={!isDisliked ? () => setIsDislikeHovered(false) : () => {}}>
                    <i className={`bi bi-hand-thumbs-down${isDislikeHovered ? "-fill" : ""}`}>

                    </i>
                </button>
            </div>
        </div>
    );
};

export default Card;