import React, {useRef, useState} from "react";
import {PostElements, Text} from "../components/addPost/elements";

const AddPost = () => {
    const [title, setTitle] = useState('');
    const [contentElements, setContentElements] = useState([]);

    const structureRef = useRef();
    const contentRef = useRef();

    return (
        <div>
            <div>
                <input placeholder='Title of your post' value={title} onChange={setTitle}/>
            </div>

            <div className="row-cols-2">
                <div className="col-1" ref={structureRef}>
                    <button>+</button>
                </div>

                <div className="col-11" ref={contentRef}>
                    {
                        contentElements.map((value) => {
                            //if (value === "elements")
                               // return <PostElements setState={setContentElements} array={contentElements}/>;

                            if (value === "text")
                                return <Text />
                            else if (value === "picture")
                                return
                        })
                    }

                    <PostElements setState={setContentElements} array={contentElements}/>
                </div>
            </div>

            {//TODO tag list
                 }
            <div>
                <datalist>
                    <option value="Edge" />
                </datalist>
            </div>

            <div>
                <button>publish</button>

                <button>delete the draft</button>

                15:34

                <button>Show the post</button>
            </div>
        </div>
    );
};

export default AddPost;