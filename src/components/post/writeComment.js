import Input from "../layout/input";
import React, {useEffect, useState} from "react";
import {addDoc, collection, updateDoc, doc} from "firebase/firestore";
import {firebaseDb} from "../../Firebase";
import {useSession, useUserCollection} from "../../hooks";

const WriteComment = props => {
    const {
        postId,
        onCommentPublished,
        isFirstComment = false,
        commentId = '',
        commentParentOrder = 0,
    } = props;
    const user = useSession();
    const {userCollection} = useUserCollection(user.uid);

    const [comment, setComment] = useState('');

    const handleComment = () => {
        if (!comment.length)
            return;

        (async () => {
            const docData = {
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

            const docRef = await addDoc(collection(firebaseDb, "comments"), docData);

            if (isFirstComment) {
                const additionalDocData = {
                    answerRiver: {
                        rootCommentId: docRef.id,
                        order: 0
                    }
                };

                const commentsRef = doc(firebaseDb, "comments", docRef.id);

                await updateDoc(commentsRef, additionalDocData);
            }

        })().then(() => {
            setComment('');
            onCommentPublished(true);
        });
    }

    useEffect(() => {
        if (comment)
            onCommentPublished(false);
    }, [comment, onCommentPublished]);

    return <>
        <Input id="commentText" placeholder="Comment here" onChange={setComment} value={comment}/>
        <button type="button" className="btn btn-outline-primary" onClick={handleComment}>
            Publish
        </button>
    </>;
}

export default WriteComment;