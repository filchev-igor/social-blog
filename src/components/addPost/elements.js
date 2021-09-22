import React, {useState} from "react";
import Input from "../layout/input";
import Textarea from "../layout/textarea";
import {DELETE_ELEMENT} from "../../constants";

export const Text = ({dispatch, index, value, dataDragId}) => {
    const handleChange = value => dispatch({
        type: "update text",
        index: index,
        value: value
    });

    return (
        <Textarea
            dataDragId={dataDragId}
            placeholder='Type the text'
            value={value}
            onChange={handleChange}/>
    );
};

export const ImageLink = ({dispatch, index, value, dataDragId}) => {
    const handleChange = value => dispatch({
        type: "update link to image",
        index: index,
        value: value
    });

    return (
        <Input
            dataDragId={dataDragId}
            placeholder="Type link to image"
            value={value}
            onChange={handleChange}/>
    );
};

export const VideoLink = ({dispatch, index, value, dataDragId}) => {
    const handleChange = value => dispatch({
        type: "update link to youtube",
        index: index,
        value: value
    });

    return (
        <Input
            dataDragId={dataDragId}
            placeholder="Type link to youtube"
            value={value}
            onChange={handleChange}/>
        );
};

const PostButton = ({text, onClick}) => (
    <button type="button" className="btn btn-primary me-2" onClick={onClick}>{text}</button>
);

export const PostElements = ({dispatch, index}) => {
    const handleAddElement = value => dispatch({
        type: value,
        index: index
    });

    return <>
        <PostButton onClick={() => handleAddElement("add text")} text="Text"/>

        <PostButton onClick={() => handleAddElement("add link to image")} text="Link to picture"/>

        <PostButton onClick={() => handleAddElement("add link to youtube")} text="Link to youtube"/>
    </>;
}

export const AddElementButton = ({dispatch, index}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleAddElementsSelector = () => dispatch({
        type: "add elements selector",
        index: index
    });

    return (
        <button
            className={`btn btn${!isHovered ? "-outline" : ""}-success`}
            onClick={handleAddElementsSelector}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <i className={`bi bi-plus-circle${isHovered ? "-dotted" : ""}`}>

            </i>
        </button>
    );
};

export const DraggableElement = ({id}) => {
    const [isDragStart, setIsDragStart] = useState(false);

    const handleDragStart = e => {
        setIsDragStart(true);

        e.dataTransfer.setData(JSON.stringify(e.target.dataset.dragId), '');
    }

    const handleDragEnd = () => setIsDragStart(false);

    return (
        <button
            data-drag-id={id}
            draggable={true}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={`btn btn-outline-${isDragStart ? "danger" : "warning"}`}>
            <i data-drag-id={id} className={`bi bi-chevron-bar-${!isDragStart ? "expand" : "contract"}`}>

            </i>
        </button>
    );
}

export const DeleteElement = ({dispatch, index, id}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleDeleteElement = () => {
        if (!window.confirm(DELETE_ELEMENT))
            return;

        dispatch({
            type: "delete element",
            index: index
        });
    }

    return (
        <button
            className="btn btn-outline-danger"
            onClick={handleDeleteElement}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <i id={id} className={`bi bi-x-circle${!isHovered ? "-fill" : ""}`}>

            </i>
        </button>
    );
};

export const ElementCentered = props => {
    const {
        id,
        handleDragEnterEvent,
        handleDragOverEvent,
        ended,
        started
    } = props;

    return (<>
        <div data-drag-id={id} className="col-1" onDragOver={handleDragOverEvent} onDragEnter={handleDragEnterEvent}>{started}</div>

        <div data-drag-id={id} className="col-10" onDragOver={handleDragOverEvent} onDragEnter={handleDragEnterEvent}>{props.children}</div>

        <div className="col-1">{ended}</div>
    </>);
};

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