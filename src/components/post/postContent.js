import {useParams} from "react-router-dom";
import {usePost, useSession} from "../../hooks";
import PageDoesNotExist from "../../App/404";
import React, {useState} from "react";
import {ContainerFluid} from "../globalLayout";
import WriteComment from "./writeComment";
import CommentsList from "./commentsList";
import {CommentsContext} from "../../contexts";
import LikeButton from "../layout/likeButton";
import DislikeButton from "../layout/dislikeButtton";
import {POSTS_COLLECTION} from "../../constants/likeCollectionNames";

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

    //TODO correct variable here (both used in comment.js and postContent.js)
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
                                {commentsNumber}
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

                            <span>{rating}</span>

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

                    <CommentsContext.Provider value={{
                        commentsNumber,
                        currentCommentId, setCurrentCommentId,
                        isCommentPublished, setIsCommentPublished
                    }}>
                        <div className="card">
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
        </ContainerFluid>
    );
};

export default PostContent;