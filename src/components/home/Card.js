import React, {useEffect, useState} from "react";
import {useFullUserData, useSession} from "../../hooks";
import {Link} from "react-router-dom";
import LikeButton from "../layout/likeButton";
import DislikeButton from "../layout/dislikeButtton";
import {POSTS_COLLECTION} from "../../constants/likeCollectionNames";
import * as interfaceStyles from "../../constants/interfaceStyles";

const Card = props => {
    const {
        postStructure,
        data,
        postId
    } = props;

    const user = useSession();

    const {isLoadingUserCollection, userCollection} = useFullUserData();

    const [cardColor, setCardColor] = useState('light');
    const [textColor, setTextColor] = useState('dark');

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

    useEffect(() => {
        if (!isLoadingUserCollection) {
            const component = interfaceStyles.HOME_PAGE
                .split(" ")
                .map((value, index) => {
                    if (index)
                        return value[0].toUpperCase() + value.slice(1);

                    return value;
                })
                .join("");

            const elementStyles = userCollection['interfaceStyles'][component];

            const cardBackground = elementStyles['cardColor'];
            const textStyle = elementStyles['textColor'];

            setCardColor(cardBackground);
            setTextColor(textStyle);
        }
    }, [isLoadingUserCollection, userCollection]);

    return (
        <div className={`card mb-4 bg-${cardColor} text-${textColor}`}>
            <div className="card-header">
                {`${firstName} ${lastName} ${date}`}
            </div>

            <div className="card-body">
                <h5 className="card-title">
                    <Link
                        className={`text-decoration-none link-${textColor === "white" ? "light" : textColor}`}
                        to={`post/${postId}`}>{title}</Link>
                </h5>

                {postStructure}
            </div>

            <div className="card-footer">
                <div className="d-flex gap-2">
                    <Link className="text-decoration-none link-dark" to={`post/${postId}`}>
                        <button
                            type="button"
                            className={`btn btn-outline-${textColor === "white" ? "light" : textColor}`}>
                            <i className="bi bi-card-text">

                            </i>
                            {" " + commentsNumber}
                        </button>
                    </Link>

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
    );
};

export default Card;