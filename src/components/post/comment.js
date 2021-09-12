import React, {useContext, useState} from "react";
import {useSession} from "../../hooks";
import WriteComment from "./writeComment";
import DislikeButton from "../layout/dislikeButtton";
import LikeButton from "../layout/likeButton";
import {COMMENTS_COLLECTION} from "../../constants/likeCollectionNames";
import {CommentsContext} from "../../contexts";

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

    const [isRatingBeingManipulated, setIsRatingBeingManipulated] = useState(false);
    //const [isCommenting, setIsCommenting] = useState("root");

    const {
        currentCommentId,
        setCurrentCommentId
    } = useContext(CommentsContext);

    const handleAnswerComment = () => {
        if (currentCommentId === commentId) {
            setCurrentCommentId("root");
        }
        else {
            setCurrentCommentId(commentId);
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <h6 className="card-subtitle text-muted">{firstName} {lastName} {date}</h6>
                <p className="card-text">{text}</p>

                {commentatorUid !== user.uid &&
                <LikeButton
                    collectionName={COMMENTS_COLLECTION}
                    isRatingBeingManipulated={isRatingBeingManipulated}
                    setIsRatingBeingManipulated={setIsRatingBeingManipulated}
                    positivelyLiked={positivelyLiked}
                    negativelyLiked={negativelyLiked}
                    rating={rating}
                    docId={commentId}/>}

                {rating}

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