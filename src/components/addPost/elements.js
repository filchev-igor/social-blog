import React from "react";

export const Text = () => (
    <textarea className="form-control" rows="3" placeholder='Type the text'>

    </textarea>
);

export const VideoLink = () => (
    <input />
);

export const PostElements = ({setState, array}) => {
    return <>
        <button onClick={() => setState([...array, "text"])}>Text</button>

        <button onClick={() => setState([...array, "picture"])}>Picture</button>

        <button onClick={() => setState([...array, "imageLink"])}>Link to picture</button>

        <button onClick={() => setState([...array, "videoLink"])}>Video link</button>
    </>;
}