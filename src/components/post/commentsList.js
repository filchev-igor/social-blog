import {useCommentsCollection} from "../../hooks";
import React from "react";
import Comment from "./comment";

const CommentsList = ({onCommentPublished, postId}) => {
    const comments = useCommentsCollection(postId);

    return <>
        {comments.map(element => {
            const commentId = element.id;
            const data = element.data;

            return <Comment
                key={`comment-${commentId}`}
                commentId={commentId}
                data={data}
                postId={postId}
                onCommentPublished={onCommentPublished}/>;
        })}
        </>;
}

export default CommentsList;