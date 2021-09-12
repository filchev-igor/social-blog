import React from "react";
import Card from "./Card";

const Cards = ({publishedPosts}) => publishedPosts.map((value, index) => {
    const postId = value.id;
    const data = value.data;

    const postStructure = data.structure.map((element, index) => {
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

        //caret-up-fill caret-up caret-down-fill
        // hand-thumbs-down hand-thumbs-down-fill hand-thumbs-up
        return <Card
            key={postId + "-post-" + index}
            postStructure={postStructure}
            data={data}
            postId={postId}
        />;
});

export default Cards;