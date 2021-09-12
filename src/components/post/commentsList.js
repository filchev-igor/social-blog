import {useCommentsCollection} from "../../hooks";
import React from "react";
import RecursiveComment from "./recursiveComments";

const CommentsList = ({postId}) => {
    const comments = useCommentsCollection(postId);

    const filteredComments = comments
        .map(element => {
            const answerRiver = element.data.answerRiver;

            answerRiver.childComment = [];
            answerRiver.hasChildComment = false;

            return element;
        })
        .filter((element, index, array) => {
        const data = element.data;

        const commentOrder = data.answerRiver.order;
        const rootCommentId = data.answerRiver.rootCommentId;

        if (commentOrder) {
            const rootCommentIndex = array.findIndex(obj => obj.id === rootCommentId);

            const parentAnswerRiver = array[rootCommentIndex].data.answerRiver;

            parentAnswerRiver.hasChildComment = true;
            parentAnswerRiver.childComment.push(element);

            return false;
        }

        return true;
    });

    return <RecursiveComment comments={filteredComments} postId={postId}/>
}

export default CommentsList;