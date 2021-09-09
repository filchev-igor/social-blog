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
import {IsInitializingContext} from "../contexts";
import {useEditedPostCollection, useSession, useUserCollection} from "../hooks";
import * as ROUTES from "../constants/routes";
import {useHistory} from "react-router-dom";
import { collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import {firebaseDb} from "../Firebase";

const DELETE_DRAFT = "Do you want to delete the draft?";
const PUBLISH_POST = "Do you want to publish the draft?";

const PUBLISH_POST_SUCCESS = "Post was published";

const AddPost = () => {
    const isInitializing = useContext(IsInitializingContext);
    const user = useSession();

    const [title, setTitle] = useState('');
    const [contentElements, setContentElements] = useState([]);
    const [docId, setDocId] = useState(null);
    const [isPostBeingManipulated, setIsPostBeingManipulated] = useState(false);
    const [hasPostBeingPublished, setHasPostBeingPublished] = useState(false);

    const {isLoadingUserCollection, userCollection} = useUserCollection(isInitializing ? "" :
        user ? user.uid : "");
    const {isDraftCheckOver, docId: existingDocId, data} = useEditedPostCollection(isInitializing ? "" :
        user ? user.uid : "");

    //TODO correct name later
    const userDataRef = useRef({
        firstName: "",
        lastName: "",
        uid: null
    });

    const history = useHistory();

    const condition = authUser => !!authUser;

    const isTitleEmpty = !title;
    const isPostEmpty = !contentElements.length;

    /*
    //Callback function, which writes state of the field to the contentElements state
     */
    const handleEditContentElement = (value, index) => {
        if (!isDraftCheckOver || isPostBeingManipulated)
            return;

        const object = {
            type: contentElements[index].type,
            value: value
        }

        const array = [...contentElements];

        array.splice(index, 1, object);

        setContentElements(array);
    };

    userDataRef.current.firstName = isLoadingUserCollection ? "" : userCollection.name.first;
    userDataRef.current.lastName = isLoadingUserCollection ? "" : userCollection.name.last;
    userDataRef.current.uid = user ? user.uid : null;

    const handleTitleChange = e => {
        if (!isDraftCheckOver || isPostBeingManipulated)
            return;

        setTitle(e.target.value);
    };

    const handlePostDelete = () => {
        if (isTitleEmpty && isPostEmpty)
            return;
        
        if (!window.confirm(DELETE_DRAFT))
            return;

        setIsPostBeingManipulated(true);

        (async() => {
            const usersData = {
                hasDraft: false
            };

            await deleteDoc(doc(firebaseDb, "posts", docId));

            const usersRef = doc(firebaseDb, "users", user.uid);

            await updateDoc(usersRef, usersData);
        })().then(() => {
            setTitle('');
            setContentElements([]);
            setDocId(null);

            setIsPostBeingManipulated(false);
        });
    };

    const handlePublishPost = () => {
        if (isTitleEmpty || isPostEmpty)
            return;
        
        if (!window.confirm(PUBLISH_POST))
            return;

        setIsPostBeingManipulated(true);

        (async() => {
            const postsData = {
                "isPublished": true,
                "dates.published": new Date()
            };

            const usersData = {
                publishedPosts: userCollection.publishedPosts + 1,
                hasDraft: false
            };

            const postsRef = doc(firebaseDb, "posts", docId);

            await updateDoc(postsRef, postsData);

            const usersRef = doc(firebaseDb, "users", user.uid);

            await updateDoc(usersRef, usersData);
        })().then(() => {
            setTitle('');
            setContentElements([]);
            setDocId(null);

            setIsPostBeingManipulated(false);
            setHasPostBeingPublished(true);
        });
    };

    useEffect(() => {
        if (isDraftCheckOver && existingDocId) {
            setDocId(existingDocId);
            setTitle(data.title);
            setContentElements(data.structure);
        }
    }, [data, existingDocId, isDraftCheckOver]);

    useEffect(() => {
        const {firstName, lastName, uid} = userDataRef.current;

        if (isTitleEmpty && isPostEmpty)
            return;

        if (isPostBeingManipulated)
            return;

        //TODO Take a look at the error field (it is empty!)
        const createPost = async() => {
            setIsPostBeingManipulated(true);

            const postsData = {
                title: title,
                creator: {
                    first: firstName,
                    last: lastName,
                    uid: uid
                },
                dates: {
                    created: new Date()
                },
                structure: contentElements,
                isPublished: false,
                rating: 0,
                likedBy : {
                    positively: [],
                    negatively: []
                }
            };

            const usersData = {
                hasDraft: true
            };

            const postRef = await addDoc(collection(firebaseDb, "posts"), postsData);

            const usersRef = doc(firebaseDb, "users", user.uid);

            await updateDoc(usersRef, usersData);

            setDocId(postRef.id);
        };

        const editPost = async() => {
            const docData = {
                title: title,
                structure: contentElements
            };

            const docRef = doc(firebaseDb, "posts", docId);

            await updateDoc(docRef, docData);
        };

        try {
            if (!docId)
                createPost().then(() => {
                    setIsPostBeingManipulated(false);
                    setHasPostBeingPublished(false);
                });
            else
                editPost().then();
        }
        catch (e) {

        }
    }, [title, contentElements, docId, isPostBeingManipulated, isTitleEmpty, isPostEmpty]);

    if (isInitializing)
        return null;

    if (!isInitializing && !condition(user)) {
        history.push(ROUTES.SIGN_IN);

        return null;
    }

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
                        onChange={handleTitleChange}/>
                </div>

                <div className="col-1">

                </div>

                {hasPostBeingPublished && <>
                <div className="col-1">

                </div>

                <div className="col-10">
                    <div className="alert alert-success mt-3" role="alert">{PUBLISH_POST_SUCCESS}</div>
                </div>

                <div className="col-1">

                </div> </>}

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
                                callback={handleEditContentElement}/>}

                            {value.type === "picture"}

                            {value.type === "image link" &&
                            <ImageLink
                                index={index}
                                value={value.value}
                                callback={handleEditContentElement}/>}

                            {value.type === "video link" &&
                            <VideoLink
                                index={index}
                                value={value.value}
                                callback={handleEditContentElement}/>}

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
                    <button onClick={handlePublishPost}>publish</button>

                    <button onClick={handlePostDelete}>delete the draft</button>

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