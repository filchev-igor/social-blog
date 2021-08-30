import React, {Fragment, useContext, useEffect, useRef, useState} from "react";
import {
    AddElementButton, DeleteElement,
    DraggableElement,
    ImageLink,
    PostElements,
    Text,
    VideoLink
} from "../components/addPost/elements";
import {ContainerFluid} from "../components/globalLayout";
import {AuthUserContext} from "../contexts";
import {firebaseFirestore} from "../Firebase";

const AddPost = () => {
    const authUser = useContext(AuthUserContext);

    const [title, setTitle] = useState('');
    const [contentElements, setContentElements] = useState([]);

    //TODO correct name later
    const userDataRef = useRef({
        firstName: "Jane",
        lastName: "Doe",
        uid: null
    });

    const docIdRef = useRef('');
    /*
    //Callback function, which writes state of the field to the contentElements state
     */
    const editContentElementValue = (value, index) => {
        const object = {
            type: contentElements[index].type,
            value: value
        }

        const array = [...contentElements];

        array.splice(index, 1, object);

        setContentElements(array);
    };

    userDataRef.current.uid = authUser ? authUser.uid : null;

    useEffect(() => {
        const {firstName, lastName, uid} = userDataRef.current;
        const docId = docIdRef.current;

        //TODO Take a look at the error field (it is empty!)
        if (docIdRef.current === '') {
            const docData = {
                title: title,
                creator: {
                    first: firstName,
                    last: lastName,
                    uid: uid
                },
                dates: {
                    created: new Date()
                },
                structure: contentElements
            };

            firebaseFirestore.collection("posts")
                .add(docData)
                .then(docRef => docIdRef.current = docRef.id)
                .catch(error => {

                });
        }
        else {
            const docData = {
                title: title,
                structure: contentElements
            };

            firebaseFirestore.collection("posts").doc(docId)
                .update(docData)
                .then()
                .catch(error => {});
        }
    }, [title, contentElements]);

    return (
        <ContainerFluid>
            <div className="row gy-3">
                <div className="col-1">

                </div>

                <div className="col-10">
                    <input
                        className="form-control"
                        placeholder='Title of your post'
                        value={title}
                        onChange={e => setTitle(e.target.value)}/>
                </div>

                <div className="col-1">

                </div>

                {contentElements.map((value, index) => {
                    return <Fragment key={"Add element " + index}>
                        <div className="col-1">
                            <AddElementButton setState={setContentElements} array={contentElements} index={index}/>
                        </div>

                        <div className="col-11">

                        </div>

                        <div className="col-1">
                            <DraggableElement/>
                        </div>

                        <div className="col-10">
                            {value.type === "text" &&
                            <Text
                                index={index}
                                value={value.value}
                                callback={editContentElementValue}/>}

                            {value.type === "picture"}

                            {value.type === "image link" &&
                            <ImageLink
                                index={index}
                                value={value.value}
                                callback={editContentElementValue}/>}

                            {value.type === "video link" &&
                            <VideoLink
                                index={index}
                                value={value.value}
                                callback={editContentElementValue}/>}

                            {value.type === "add element" &&
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