import React, {useState} from "react";
import {useSession} from "../../hooks";
import {Link} from "react-router-dom";
import LikeButton from "../layout/likeButton";
import DislikeButton from "../layout/dislikeButtton";

const Card = props => {
    const {
        postStructure,
        data,
        postId
    } = props;

    const user = useSession();

    const likedBy = data.likedBy;

    const positivelyLiked = likedBy.positively;
    const negativelyLiked = likedBy.negatively;

    const [isRatingBeingManipulated, setIsRatingBeingManipulated] = useState(false);

    const firstName = data.creator.first;
    const lastName = data.creator.last;
    const creatorUid = data.creator.uid;
    const date = data.dates.published;
    const title = data.title;
    const rating = data.rating;
    const commentsNumber = data.comments;

    return (
        <div className="card mb-4">
            <div className="card-header">
                {`${firstName} ${lastName} ${date}`}
            </div>

            <div className="card-body">
                <h5 className="card-title">
                    <Link className="text-decoration-none link-dark" to={`post/${postId}`}>{title}</Link>
                </h5>

                {postStructure}
            </div>

            <div className="card-footer">
                <Link className="text-decoration-none link-dark" to={`post/${postId}`}>
                    <button type="button" className="btn btn-light">
                        <i className="bi bi-card-text">

                        </i>
                        {commentsNumber}
                    </button>
                </Link>

                {creatorUid !== user.uid &&
                <LikeButton
                    isRatingBeingManipulated={isRatingBeingManipulated}
                    setIsRatingBeingManipulated={setIsRatingBeingManipulated}
                    positivelyLiked={positivelyLiked}
                    negativelyLiked={negativelyLiked}
                    rating={rating}
                    postId={postId}/>}

                <span>{rating}</span>

                {creatorUid !== user.uid &&
                <DislikeButton
                    isRatingBeingManipulated={isRatingBeingManipulated}
                    setIsRatingBeingManipulated={setIsRatingBeingManipulated}
                    positivelyLiked={positivelyLiked}
                    negativelyLiked={negativelyLiked}
                    rating={rating}
                    postId={postId}/>}
            </div>
        </div>
    );
};

export default Card;