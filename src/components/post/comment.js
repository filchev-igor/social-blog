import React, {useContext, useEffect, useState} from "react";
import {useFullUserData, useSession} from "../../hooks";
import WriteComment from "./writeComment";
import DislikeButton from "../layout/dislikeButtton";
import LikeButton from "../layout/likeButton";
import {COMMENTS_COLLECTION} from "../../constants/firebase";
import {CommentsContext} from "../../contexts";
import * as interfaceStyles from "../../constants/interfaceStyles";

const Comment = props => {
    const {
        postId,
        commentId,
        data
    } = props;

    const user = useSession();

    const {isLoadingUserCollection, userCollection} = useFullUserData();

    const commentatorUid = data.commentator.uid;
    const firstName = data.commentator.first;
    const lastName = data.commentator.last;
    const date = data.date;
    const text = data.text;
    const rating = data.rating;
    const negativelyLiked = data.likedBy.negatively;
    const positivelyLiked = data.likedBy.positively;
    const commentParentOrder = data.answerRiver.order;

    const [isRatingBeingManipulated, setIsRatingBeingManipulated] = useState(false);
    const [background, setBackground] = useState('white');
    const [textColor, setTextColor] = useState('dark');

    const {currentCommentId, setCurrentCommentId} = useContext(CommentsContext);

    const handleAnswerComment = () => {
        if (currentCommentId === commentId)
            setCurrentCommentId("root");
        else
            setCurrentCommentId(commentId);
    };

    useEffect(() => {
        if (!isLoadingUserCollection) {
            const component = interfaceStyles.COMMENTS
                .split(" ")
                .map((value, index) => {
                    if (index)
                        return value[0].toUpperCase() + value.slice(1);

                    return value;
                })
                .join("");

            const postElementStyles = userCollection['interfaceStyles'][component];

            const backgroundColor = postElementStyles['background'];
            const textStyle = postElementStyles['textColor'];

            setBackground(backgroundColor);
            setTextColor(textStyle);
        }
    }, [isLoadingUserCollection, userCollection]);

    return (
        <div className={`card bg-${background} text-${textColor} border-0`}>
            <div className="card-body">
                <h6 className="card-title">{firstName} {lastName} <span className={`text-${textColor === "dark" ? "white" : "dark"}`}>{date}</span></h6>

                <p className="card-text">{text}</p>

                <div className="gap-2 d-flex">
                    {commentatorUid !== user.uid &&
                    <LikeButton
                        collectionName={COMMENTS_COLLECTION}
                        isRatingBeingManipulated={isRatingBeingManipulated}
                        setIsRatingBeingManipulated={setIsRatingBeingManipulated}
                        positivelyLiked={positivelyLiked}
                        negativelyLiked={negativelyLiked}
                        rating={rating}
                        docId={commentId}/>}

                    <button type="button" className={`btn text-${textColor}`} disabled={true}>{rating}</button>

                    {commentatorUid !== user.uid &&
                    <DislikeButton
                        collectionName={COMMENTS_COLLECTION}
                        isRatingBeingManipulated={isRatingBeingManipulated}
                        setIsRatingBeingManipulated={setIsRatingBeingManipulated}
                        positivelyLiked={positivelyLiked}
                        negativelyLiked={negativelyLiked}
                        rating={rating}
                        docId={commentId}/>}

                    <button
                        type="button"
                        className={`btn btn-outline-${currentCommentId !== commentId ? "primary" : "danger"}`}
                        onClick={handleAnswerComment}>
                        {currentCommentId !== commentId ? "Answer" : "Cancel"}
                    </button>
                </div>

                {currentCommentId === commentId &&
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