import {useParams} from "react-router-dom";
import {useFullUserData, usePost, useSession} from "../../hooks";
import PageDoesNotExist from "../../App/404";
import React, {useEffect, useState} from "react";
import {ContainerFluid} from "../globalLayout";
import WriteComment from "./writeComment";
import CommentsList from "./commentsList";
import {CommentsContext} from "../../contexts";
import LikeButton from "../layout/likeButton";
import DislikeButton from "../layout/dislikeButtton";
import {POSTS_COLLECTION} from "../../constants/firebase";
import PlaceholderCard from "../layout/placeholderCard";
import * as interfaceStyles from "../../constants/interfaceStyles";

const PostContent = () => {
    const {postId} = useParams();

    const {isPostChecking, isPostExisting, data} = usePost(postId);

    const {
        firstName,
        lastName,
        creatorUid,
        date,
        title,
        rating,
        structure,
        likedBy : {
            negatively : negativelyLiked,
            positively : positivelyLiked
        },
        comments : commentsNumber
    } = data;

    const user = useSession();

    const {isLoadingUserCollection, userCollection} = useFullUserData();

    const [background, setBackground] = useState('white');
    const [cardColor, setCardColor] = useState('light');
    const [textColor, setTextColor] = useState('dark');
    const [commentsBackground, setCommentsBackground] = useState('white');

    const [isRatingBeingManipulated, setIsRatingBeingManipulated] = useState(false);
    const [isCommentPublished, setIsCommentPublished] = useState(false);
    const [currentCommentId, setCurrentCommentId] = useState("root");

    const postStructure = structure.map((element, index) => {
        const value = [];

        if (element.type === "video link")
            return false;

        if (element.type === "text")
            value.push(element.value);
        else if (element.type === "image link")
            value.push(<img src={element.value} className="img-fluid" alt="Element is not loaded" />);
        //else if (element.type === "video link")
        //value.push(element.value);

        return <p key={postId + "-element-" + index} className="card-text">{value[0]}</p>;
    });

    useEffect(() => {
        if (!isLoadingUserCollection) {
            const postComponent = interfaceStyles.POST_PAGE
                .split(" ")
                .map((value, index) => {
                    if (index)
                        return value[0].toUpperCase() + value.slice(1);

                    return value;
                })
                .join("");

            const commentsComponent = interfaceStyles.COMMENTS
                .split(" ")
                .map((value, index) => {
                    if (index)
                        return value[0].toUpperCase() + value.slice(1);

                    return value;
                })
                .join("");

            const postElementStyles = userCollection['interfaceStyles'][postComponent];

            const backgroundColor = postElementStyles['background'];
            const cardBackground = postElementStyles['cardColor'];
            const textStyle = postElementStyles['textColor'];

            const commentsElementStyles = userCollection['interfaceStyles'][commentsComponent];

            setBackground(backgroundColor);
            setCardColor(cardBackground);
            setTextColor(textStyle);

            setCommentsBackground(commentsElementStyles['background'])
        }
    }, [isLoadingUserCollection, userCollection]);

    if (isPostChecking) {
        return (
            <ContainerFluid>
                <div className="row justify-content-center">
                    <div className="col col-sm-9 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                        <PlaceholderCard/>
                    </div>
                </div>
            </ContainerFluid>
        );
    }

    if (!isPostChecking && !isPostExisting)
        return <PageDoesNotExist/>;

    return (
        <div className={`container-fluid py-5 min-vh-100 bg-${background}`}>
            <div className="row justify-content-center">
                <div className="col col-sm-9 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                    <div className={`card mb-4 bg-${cardColor} text-${textColor}`}>
                        <div className="card-header">
                            {`${firstName} ${lastName} ${date}`}
                        </div>

                        <div className="card-body">
                            <h5 className="card-title">{title}</h5>

                            {postStructure}
                        </div>

                        <div className="card-footer">
                            <div className="gap-2 d-flex">
                                <button
                                    type="button"
                                    className={`btn btn-${textColor === "white" ? "light" : textColor}`}
                                    disabled={true}>
                                    <i className="bi bi-card-text">

                                    </i>
                                    {" " + commentsNumber}
                                </button>

                                {creatorUid !== user.uid &&
                                <LikeButton
                                    collectionName={POSTS_COLLECTION}
                                    isRatingBeingManipulated={isRatingBeingManipulated}
                                    setIsRatingBeingManipulated={setIsRatingBeingManipulated}
                                    positivelyLiked={positivelyLiked}
                                    negativelyLiked={negativelyLiked}
                                    rating={rating}
                                    docId={postId}/>}

                                <button type="button" className={`btn text-${textColor}`} disabled={true}>{rating}</button>

                                {creatorUid !== user.uid &&
                                <DislikeButton
                                    collectionName={POSTS_COLLECTION}
                                    isRatingBeingManipulated={isRatingBeingManipulated}
                                    setIsRatingBeingManipulated={setIsRatingBeingManipulated}
                                    positivelyLiked={positivelyLiked}
                                    negativelyLiked={negativelyLiked}
                                    rating={rating}
                                    docId={postId}/>}
                            </div>
                        </div>
                    </div>

                    <CommentsContext.Provider value={{
                        commentsNumber,
                        currentCommentId, setCurrentCommentId,
                        isCommentPublished, setIsCommentPublished
                    }}>
                        <div className={`card bg-${commentsBackground}`}>
                            <div className="card-body">
                                <CommentsList postId={postId} onCommentPublished={setIsCommentPublished}/>
                            </div>
                            <div className="card-footer">
                                {currentCommentId === "root" &&
                                <WriteComment
                                    postId={postId}
                                    onCommentPublished={setIsCommentPublished}
                                    isFirstComment={true}/>}

                                {currentCommentId !== "root" &&
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => setCurrentCommentId("root")}>
                                    Write new comment
                                </button>}

                                {isCommentPublished &&
                                <div className="alert alert-success mt-3" role="alert">Your comment was published</div>}
                            </div>
                        </div>
                    </CommentsContext.Provider>
                </div>
            </div>
        </div>
    );
};

export default PostContent;