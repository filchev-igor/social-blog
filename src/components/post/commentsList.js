import {useCommentsCollection} from "../../hooks";
import React from "react";
import Comment from "./comment";

const CommentsList = ({onCommentPublished, postId}) => {
    const comments = useCommentsCollection(postId);

    const filteredComments = comments.filter((element, index, array) => {
        const data = element.data;

        const commentOrder = data.answerRiver.order;
        const rootCommentId = data.answerRiver.rootCommentId;

        data.answerRiver.hasChildComment = false;
        data.answerRiver.childComment = []

        if (commentOrder) {
            const rootCommentIndex = array.findIndex(obj => obj.id === rootCommentId);

            array[rootCommentIndex].data.answerRiver.hasChildComment = true;
            array[rootCommentIndex].data.answerRiver.childComment.push(element);

            return false;
        }

        return true;
    });

    const commentsRender = array => array.map(element => {
        const commentId = element.id;
        const data = element.data;

        const hasChildComment = data.answerRiver.hasChildComment;

        return <Comment
            key={`comment-${commentId}`}
            commentId={commentId}
            data={data}
            postId={postId}
            onCommentPublished={onCommentPublished}>

            {hasChildComment && commentsRender(data.answerRiver.childComment)}
        </Comment>;

    });

    return commentsRender(filteredComments);
}

export default CommentsList;