import React, {useState} from "react";

export const Text = () => {
    const [state, setState] = useState('');

    return (
        <textarea
            className="form-control"
            rows="3"
            placeholder='Type the text'
            value={state}
            onChange={e => setState(e.target.value)}>

        </textarea>
    );
};

export const ImageLink = () => {
    const [state, setState] = useState('');

    return (
        <input
            className="form-control"
            placeholder="Type link to image"
            value={state}
            onChange={e => setState(e.target.value)}/>
    );
};

export const VideoLink = () => {
    const [state, setState] = useState('');

    return (
        <input
            className="form-control"
            placeholder="Type link to video"
            value={state}
            onChange={e => setState(e.target.value)}/>
        );
};

export const PostElements = props => {
    const handlerFunc = value => {
        if (props.array.length)
            props.array.splice(props.index, 1, value);
        else
            props.array.push(value);

        props.setState([...props.array]);
    };

    return <>
        <button onClick={() => handlerFunc("text")}>Text</button>

        <button onClick={() => handlerFunc("picture")}>Picture</button>

        <button onClick={() => handlerFunc("image link")}>Link to picture</button>

        <button onClick={() => handlerFunc("video link")}>Video link</button>
    </>;
}

export const AddElementButton = props => {
    const handlerFunc = () => {
        props.array.splice(props.index, 0, "add element");

        props.setState([...props.array]);
    };

    return <button onClick={handlerFunc}>+</button>;
};

export const DraggableElement = () => (
    <button>=</button>
);

export const DeleteElement = props => {
    const handlerFunc = () => {
        props.array.splice(props.index, 1);

        props.setState([...props.array]);
    };

    return <button onClick={handlerFunc}>x</button>;
};