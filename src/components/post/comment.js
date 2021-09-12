import React, {useEffect, useState} from "react";
import {useSession} from "../../hooks";
import {arrayRemove, arrayUnion, doc, updateDoc} from "firebase/firestore";
import {firebaseDb} from "../../Firebase";
import WriteComment from "./writeComment";

const Comment = props => {
    const {
        postId,
        commentId,
        data
    } = props;

    const user = useSession();

    const commentatorUid = data.commentator.uid;
    const firstName = data.commentator.first;
    const lastName = data.commentator.last;
    const date = data.date;
    const text = data.text;
    const rating = data.rating;
    const negativelyLiked = data.likedBy.negatively;
    const positivelyLiked = data.likedBy.positively;
    const commentParentOrder = data.answerRiver.order;

    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [isLikeHovered, setIsLikeHovered] = useState(false);
    const [isDislikeHovered, setIsDislikeHovered] = useState(false);
    const [isUserAnsweringComment, setIsUserAnsweringComment] = useState(false);

    const handleEvaluatedPositively = (isUserRecallingMark = false) => {
        (async () => {
            const newRating = negativelyLiked.includes(user.uid) && !isUserRecallingMark ? 2 : 1;

            const docData = {
                "rating": rating + newRating,
                "likedBy.positively": !isUserRecallingMark ? arrayUnion(user.uid) : arrayUnion(),
                "likedBy.negatively": arrayRemove(user.uid)
            };

            const docRef = doc(firebaseDb, "comments", commentId);

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

            const docRef = doc(firebaseDb, "comments", commentId);

            await updateDoc(docRef, docData);
        })().then(() => {
            setIsLiked(false);
            setIsDisliked(!isUserRecallingMark);
        });
    };

    const handleAnswerComment = () => setIsUserAnsweringComment(!isUserAnsweringComment);

    useEffect(() => {
        setIsLiked(positivelyLiked.includes(user.uid));
        setIsDisliked(negativelyLiked.includes(user.uid));
    },[negativelyLiked, positivelyLiked, user.uid]);

    const handleHooverLikeButtons = (isHovered) => {
        if (!isLiked)
            setIsLikeHovered(isHovered);
    };

    const handleHooverDislikeButtons = (isHovered) => {
        if (!isDisliked)
            setIsDislikeHovered(isHovered);
    };

    return (
        <div className="card">
            <div className="card-body">
                <h6 className="card-subtitle text-muted">{firstName} {lastName} {date}</h6>
                <p className="card-text">{text}</p>

                {commentatorUid !== user.uid &&
                <button
                    type="button"
                    className={`btn btn-${!isLiked ? "outline-" : ""}success`}
                    onClick={!isLiked ? () => handleEvaluatedPositively(): () => handleEvaluatedNegatively(true)}
                    onMouseEnter={() => handleHooverLikeButtons(true)}
                    onMouseLeave={() => handleHooverLikeButtons(false)}>
                    <i className={`bi bi-hand-thumbs-up${isLikeHovered ? "-fill" : ""}`}>

                    </i>
                </button>}

                {rating}

                {commentatorUid !== user.uid &&
                <button
                    type="button"
                    className={`btn btn-${!isDisliked ? "outline-" : ""}danger`}
                    onClick={!isDisliked ? () => handleEvaluatedNegatively() : () => handleEvaluatedPositively(true)}
                    onMouseEnter={() => handleHooverDislikeButtons(true)}
                    onMouseLeave={() => handleHooverDislikeButtons(false)}>
                    <i className={`bi bi-hand-thumbs-down${isDislikeHovered ? "-fill" : ""}`}>

                    </i>
                </button>}

                <button type="button" className={`btn btn-outline-${!isUserAnsweringComment ? "primary" : "danger"}`} onClick={handleAnswerComment}>
                    {!isUserAnsweringComment ? "Answer" : "Cancel"}
                </button>

                {isUserAnsweringComment &&
                <WriteComment
                    postId={postId}
                    commentId={commentId}
                    commentParentOrder={commentParentOrder}/>}

                {props.children}
            </div>
        </div>
    );
};

export default Comment;