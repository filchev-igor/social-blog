import React from "react";
import Card from "./Card";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";

const Cards = ({publishedPosts}) => publishedPosts.map(value => {
    const cardId = generateUniqueID();
    const postId = value.id;
    const data = value.data;

    const postStructure = data.structure.map(element => {
        const cardElementsId = generateUniqueID();

        const getCardValue = () => {
            if (element.type === "text") {
                return element.value;
            } else if (element.type === "link to image") {
                return (
                    <img src={element.value} className="img-fluid" alt="Element is not loaded"/>
                );
            } else if (element.type === "link to youtube") {
                const url = element.value.split("?");

                const path = url[0].split("/");
                const query = url[1].split("=");

                const videoId = path[path.length - 1];
                const timeMark = query[1];

                const validUrl = `https://www.youtube.com/embed/${videoId}?start=${timeMark}`;

                return (
                    <div className="ratio ratio-16x9">
                        <iframe src={validUrl}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen>

                        </iframe>
                    </div>
                );
            }
        };

        return <p key={cardElementsId} className="card-text">{getCardValue()}</p>;
    });


    return <Card key={cardId} postStructure={postStructure} data={data} postId={postId}/>;
});

export default Cards;