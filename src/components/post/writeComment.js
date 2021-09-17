import Input from "../layout/input";
import React, {useContext, useEffect, useState} from "react";
import {addDoc, collection, updateDoc, doc} from "firebase/firestore";
import {firebaseDb} from "../../Firebase";
import {useFullUserData, useSession} from "../../hooks";
import {CommentsContext} from "../../contexts";

const WriteComment = props => {
    const {
        commentsNumber,
        isCommentPublished,
        setIsCommentPublished,
        setCurrentCommentId
    } = useContext(CommentsContext);

    const [hasNotNamedUser, setHasNotNamedUser] = useState(false);
    
    const {
        postId,
        isFirstComment = false,
        commentId = "",
        commentParentOrder = 0,
    } = props;

    const user = useSession();

    const {userCollection} = useFullUserData();

    const [comment, setComment] = useState('');

    const handleComment = () => {
        if (!comment.length)
            return;

        if (hasNotNamedUser)
            return;

        (async () => {
            const commentsDocData = {
                postId: postId,
                commentator: {
                    first: userCollection.name.first,
                    last: userCollection.name.last,
                    uid: user.uid
                },
                text: comment,
                date: new Date(),
                rating: 0,
                likedBy: {
                    positively: [],
                    negatively: []
                },
                answerRiver: {
                    rootCommentId: commentId,
                    order: isFirstComment ? 0 : commentParentOrder + 1
                }
            };

            const postsDocData = {
                comments: commentsNumber + 1
            };

            const commentsDocRef = await addDoc(collection(firebaseDb, "comments"), commentsDocData);

            if (isFirstComment) {
                const updatedCommentsDocData = {
                    answerRiver: {
                        rootCommentId: commentsDocRef.id,
                        order: 0
                    }
                };

                const updatedCommentsRef = doc(firebaseDb, "comments", commentsDocRef.id);

                await updateDoc(updatedCommentsRef, updatedCommentsDocData);
            }

            const updatedPostsRef = doc(firebaseDb, "posts", postId);

            await updateDoc(updatedPostsRef, postsDocData);
        })().then(() => {
            setComment('');
            setIsCommentPublished(true);
            setCurrentCommentId("root");
        });
    }

    useEffect(() => {
        if (isCommentPublished && comment.length)
            setIsCommentPublished(false);
    }, [comment, isCommentPublished, setIsCommentPublished]);
    
    useEffect(() => {
        if (userCollection.name.first && userCollection.name.last)
            setHasNotNamedUser(false);
        else 
            setHasNotNamedUser(true);
    }, [userCollection.name.first, userCollection.name.last]);

    return <>
        <Input placeholder="Comment here" onChange={setComment} value={comment}/>

        <button type="button" className="btn btn-outline-primary" onClick={handleComment}>
            Publish
        </button>

        {hasNotNamedUser &&
        <div className="alert alert-danger mt-3" role="alert">
            Impossible to publish post without any name
        </div>}
    </>;
}

export default WriteComment;