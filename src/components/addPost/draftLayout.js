import React, {Fragment} from "react";
import {
    AddElementButton,
    DeleteElement,
    DraggableElement,
    ElementCentered, ElementStarted,
    ImageLink, PostElements,
    Text,
    VideoLink
} from "./elements";

const DraftLayout = ({state, dispatch}) => {
    const handleDragOverEvent = e => e.preventDefault();

    const handleDragEnterEvent = e => {
        const dropItemDragId = JSON.parse(e.dataTransfer.types[0]);

        const dropItemIndex = state
            .map(value => value.id)
            .indexOf(dropItemDragId);
        const currentItemIndex = state
            .map(value => value.id)
            .indexOf(e.target.dataset.dragId);

        const dropItemObj = {
            type: state[currentItemIndex].type,
            value: state[currentItemIndex].value,
            id: e.target.dataset.dragId
        };

        const currentItemObj = {
            type: state[dropItemIndex].type,
            value: state[dropItemIndex].value,
            id: dropItemDragId
        };

        state[dropItemIndex] = dropItemObj;
        state[currentItemIndex] = currentItemObj;

        dispatch({type: "change elements places", array: state});

        e.dataTransfer.clearData();
    };

    const elements = state.map((value, index) => {
        const id = value.id;

        return <Fragment key={id}>
            <ElementStarted>
                <AddElementButton dispatch={dispatch} index={index}/>
            </ElementStarted>

            {value.type !== "elements selector" &&
            <ElementCentered
                handleDragOverEvent={handleDragOverEvent}
                handleDragEnterEvent={handleDragEnterEvent}
                id={id}
                started={
                    <DraggableElement id={id}/>}
                ended={
                    <DeleteElement dispatch={dispatch} index={index}/>}>

                {value.type === "text" &&
                <Text
                    dataDragId={id}
                    index={index}
                    value={value.value}
                    dispatch={dispatch}/>}

                {value.type === "link to image" &&
                <ImageLink
                    dataDragId={id}
                    index={index}
                    value={value.value}
                    dispatch={dispatch}/>}

                {value.type === "link to youtube" &&
                <VideoLink
                    dataDragId={id}
                    index={index}
                    value={value.value}
                    dispatch={dispatch}/>}
            </ElementCentered>}

            {value.type === "elements selector" &&
            <ElementCentered>
                <PostElements dispatch={dispatch} index={index}/>
            </ElementCentered>}
        </Fragment>
    });

    return (
        <>
            {elements}

            <ElementCentered>
                <PostElements dispatch={dispatch} index={state.length}/>
            </ElementCentered>
        </>
    );
};

export default DraftLayout;
