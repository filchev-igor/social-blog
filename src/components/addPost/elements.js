import React, {useEffect, useRef, useState} from "react";

import { Tooltip } from 'bootstrap/dist/js/bootstrap.esm.min';
import Input from "../layout/input";
import Textarea from "../layout/textarea";

export const Text = props => {
    const [state, setState] = useState(props.value);

    const handleChange = value => {
        setState(value);

        props.callback(value, props.index);
    };

    return (
        <Textarea
            placeholder='Type the text'
            value={state}
            onChange={handleChange}/>
    );
};

export const ImageLink = props => {
    const [state, setState] = useState(props.value);

    const handleChange = value => {
        setState(value);

        props.callback(value, props.index);
    };

    return (
        <Input
            placeholder="Type link to image"
            value={state}
            onChange={handleChange}/>
    );
};

export const VideoLink = props => {
    const [state, setState] = useState(props.value);

    const handleChange = value => {
        setState(value);

        props.callback(value, props.index);
    };

    return (
        <Input
            placeholder="Type link to video"
            value={state}
            onChange={handleChange}/>
        );
};

const PostButton = ({text, onClick}) => (
    <button type="button" className="btn btn-primary me-2" onClick={onClick}>{text}</button>
);

export const PostElements = props => {
    const {
        array,
        index = array.length
    } = props;

    const handlerFunc = value => {
        if (array.length)
            array.splice(index, 1, value);
        else
            array.push(value);

        props.setState([...array]);
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
    const [isHovered, setIsHovered] = useState(false);

    const handlerFunc = () => {
        props.array.splice(props.index, 0, {
            type: "add element"
        });

        props.setState([...props.array]);
    };

    return (
        <button
            className={`btn btn${!isHovered ? "-outline" : ""}-success`}
            onClick={handlerFunc}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <i className={`bi bi-plus-circle${isHovered ? "-dotted" : ""}`}>

            </i>
        </button>
    );
};

export const DraggableElement = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            className={`btn btn${!isHovered ? "-outline" : ""}-warning`}
            draggable={true}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <i className={`bi bi-droplet${isHovered ? "-fill" : ""}`}>

            </i>
        </button>
    );
}

export const DeleteElement = props => {
    const [isHovered, setIsHovered] = useState(false);

    const handlerFunc = () => {
        props.array.splice(props.index, 1);

        props.setState([...props.array]);
    };

    return (
        <button
            className={`btn btn${!isHovered ? "-outline" : ""}-danger`}
            onClick={handlerFunc}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <i className={`bi bi-x-circle${!isHovered ? "-fill" : ""}`}>

            </i>
        </button>
    );
};

export const PublishPost = ({handleClick, text}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            className={`btn btn${!isHovered ? "-outline" : ""}-primary`}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            {text}
        </button>
    );
}

export const DeletePost = ({handleClick, text}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            className={`btn btn${!isHovered ? "-outline" : ""}-danger`}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <i className={`bi bi-x-circle${!isHovered ? "-fill" : ""}`}>

            </i>
            {" " + text}
        </button>
    );
}

export const TogglePost = ({isPostStructureDisplayed, onClick}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            className={`btn btn${!isHovered ? "-outline" : ""}-primary`}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            {!isPostStructureDisplayed ? "Show" : "Hide"} the post
        </button>
    );
};

export const InformationButton = () => {
    const tooltipRef = useRef(null);

    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        new Tooltip(tooltipRef.current);
    }, []);

    return (
        <button
            className={`btn btn${!isHovered ? "-outline" : ""}-primary`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            data-bs-toggle="tooltip"
            data-bs-placement="top" title="All changes are saved automatically"
            ref={tooltipRef}>
            <i className={`bi bi-info-circle${isHovered ? "-fill" : ""}`}>

            </i>
        </button>
    );
};

export const ElementCentered = props => (
    <>
        <div className="col-1">{props.started}</div>

        <div className="col-10">{props.children}</div>

        <div className="col-1">{props.ended}</div>
    </>
);

export const ElementStarted = props => (
    <>
        <div className="col-1">
            {props.children}
        </div>

        <div className="col-10">

        </div>

        <div className="col-1">

        </div>
    </>
);