import Comment from "./comment";
import React from "react";

const RecursiveComment = ({comments, postId}) => comments.map(element => {
    const commentId = element.id;
    const data = element.data;

    const hasChildComment = data.answerRiver.hasChildComment;
    const childComment = data.answerRiver.childComment;

    return <Comment
        key={`comment-${commentId}`}
        commentId={commentId}
        data={data}
        postId={postId}>

        {hasChildComment && <RecursiveComment comments={childComment} postId={postId}/>}
    </Comment>;
});

export default RecursiveComment;