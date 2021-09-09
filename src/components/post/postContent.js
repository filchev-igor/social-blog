import {useParams} from "react-router-dom";
import {usePost, useSession} from "../../hooks";
import PageDoesNotExist from "../../App/404";
import React, {useEffect, useState} from "react";
import {ContainerFluid} from "../globalLayout";
import {arrayRemove, arrayUnion, doc, updateDoc} from "firebase/firestore";
import {firebaseDb} from "../../Firebase";
import WriteComment from "./writeComment";
import CommentsList from "./commentsList";

const PostContent = () => {
    const {postId} = useParams();

    const {isPostChecking, isPostExisting, data} = usePost(postId);

    const {
        firstName,
        lastName,
        date,
        title,
        rating,
        structure,
        likedBy : {
            negatively : negativelyLiked,
            positively : positivelyLiked
        }
    } = data;

    const user = useSession();

    //TODO correct variable here (both used in comment.js and postContent.js)
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const [isLikeHovered, setIsLikeHovered] = useState(false);
    const [isDislikeHovered, setIsDislikeHovered] = useState(false);
    const [isCommentPublished, setIsCommentPublished] = useState(false);
    //const [isUserAnsweringComment, setIsUserAnsweringComment] = useState(false);

    const postStructure = structure.map((element, index) => {
        const value = [];

        if (element.type === "video link")
            return false;

        if (element.type === "text")
            value.push(element.value);
        else if (element.type === "image link")
            value.push(<img src={element.value} className="img-fluid" alt="Page is not loaded" />);
        //else if (element.type === "video link")
        //value.push(element.value);

        return <p key={postId + "-element-" + index} className="card-text">{value[0]}</p>;
    });

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

    useEffect(() => {
        setIsLiked(positivelyLiked.includes(user.uid));
        setIsDisliked(negativelyLiked.includes(user.uid));
    },[negativelyLiked, positivelyLiked, user.uid]);
    
    if (isPostChecking)
        return null;

    if (!isPostChecking && !isPostExisting)
        return <PageDoesNotExist/>;

    return (
        <ContainerFluid>
            <div className="row justify-content-center">
                <div className="col col-sm-9 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                    <div className="card">
                        <div className="card-header">
                            {`${firstName} ${lastName} ${date}`}
                        </div>

                        <div className="card-body">
                            <h5 className="card-title">{title}</h5>

                            {postStructure}
                        </div>

                        <div className="card-footer">
                            <button type="button" className="btn btn-light">
                                <i className="bi bi-card-text">

                                </i>
                                56
                            </button>

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

                    <div className="card">
                        <div className="card-header">

                        </div>

                        <div className="card-body">
                            <CommentsList postId={postId} onCommentPublished={setIsCommentPublished}/>
                        </div>

                        <div className="card-footer">
                            <WriteComment postId={postId} onCommentPublished={setIsCommentPublished} isFirstComment={true}/>

                            {isCommentPublished &&
                            <div className="alert alert-success mt-3" role="alert">Your comment was published</div>}
                        </div>
                    </div>
                </div>
            </div>
        </ContainerFluid>
    );
};

export default PostContent;