import React, {useState} from "react";

export const Text = props => {
    const [state, setState] = useState(props.value);

    const handleChange = e => {
        setState(e.target.value);

        props.callback(e.target.value, props.index);
    };

    return (
        <textarea
            className="form-control"
            rows="3"
            placeholder='Type the text'
            value={state}
            onChange={handleChange}>

        </textarea>
    );
};

export const ImageLink = props => {
    const [state, setState] = useState('');

    const handleChange = e => {
        setState(e.target.value);

        props.callback(state, props.index);
    };

    return (
        <input
            className="form-control"
            placeholder="Type link to image"
            value={state}
            onChange={handleChange}/>
    );
};

export const VideoLink = props => {
    const [state, setState] = useState('');

    const handleChange = e => {
        setState(e.target.value);

        props.callback(state, props.index);
    };

    return (
        <input
            className="form-control"
            placeholder="Type link to video"
            value={state}
            onChange={handleChange}/>
        );
};

const PostButton = ({text, onClick}) => (
    <button type="button" className="btn btn-primary me-2" onClick={onClick}>{text}</button>
);

export const PostElements = props => {
    const handlerFunc = value => {
        if (props.array.length && props.index)
            props.array.splice(props.index, 1, value);
        else
            props.array.push(value);

        props.setState([...props.array]);
    };

    return <>
        <PostButton onClick={() => handlerFunc({
            type: "text",
            value: ''
        })} text="Text"/>

        <PostButton onClick={() => handlerFunc({
            type: "picture",
            value: ''
        })} text="Picture"/>

        <PostButton onClick={() => handlerFunc({
            type: "image link",
            value: ''
        })} text="Link to picture"/>

        <PostButton onClick={() => handlerFunc({
            type: "video link",
            value: ''
        })} text="Video link"/>
    </>;
}

export const AddElementButton = props => {
    const handlerFunc = () => {
        props.array.splice(props.index, 0, {
            type: "add element"
        });

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