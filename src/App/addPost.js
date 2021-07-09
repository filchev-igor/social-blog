import React, {Fragment, useState} from "react";
import {
    AddElementButton, DeleteElement,
    DraggableElement,
    ImageLink,
    PostElements,
    Text,
    VideoLink
} from "../components/addPost/elements";
import {ContainerFluid} from "../components/globalLayout";

const AddPost = () => {
    const [title, setTitle] = useState('');
    const [contentElements, setContentElements] = useState([]);

    return (
        <ContainerFluid>
            <div className="row">
                <div className="col-1">

                </div>

                <div className="col-10">
                    <input className="form-control" placeholder='Title of your post' value={title} onChange={setTitle}/>
                </div>

                <div className="col-1">

                </div>

                {contentElements.map((value, index) => {
                    return <Fragment key={value + "-" + index}>
                        <div className="col-1">
                            <AddElementButton setState={setContentElements} array={contentElements} index={index}/>
                        </div>

                        <div className="col-11">

                        </div>

                        <div className="col-1">
                            <DraggableElement/>
                        </div>

                        <div className="col-10">
                            {value === "text" &&
                            <Text/>}

                            {value === "picture"}

                            {value === "image link" &&
                            <ImageLink/>}

                            {value === "video link" &&
                            <VideoLink/>}

                            {value === "add element" &&
                            <PostElements setState={setContentElements} array={contentElements} index={index}/>}
                        </div>

                        <div className="col-1">
                            <DeleteElement setState={setContentElements} array={contentElements} index={index}/>
                        </div>
                    </Fragment>
                })}

                <div className="col-1">

                </div>

                <div className="col-10">
                    <PostElements setState={setContentElements} array={contentElements}/>
                </div>

                <div className="col-1">

                </div>

                <div className="col-1">

                </div>

                <div className="col-10">
                    <button>publish</button>

                    <button>delete the draft</button>

                    15:34

                    <button>Show the post</button>
                </div>

                <div className="col-1">

                </div>
            </div>

            {//TODO tag list
                 }
            <div>
                <datalist>
                    <option value="Edge" />
                </datalist>
            </div>
        </ContainerFluid>
    );
};

export default AddPost;