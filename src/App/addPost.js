import React, {Fragment, useContext, useEffect, useRef, useState} from "react";
import {
    AddElementButton, DeleteElement, DeletePost,
    DraggableElement, ElementCentered,
    ImageLink,
    PostElements, PublishPost,
    Text, TogglePost,
    VideoLink
} from "../components/addPost/elements";
import {IsInitializingContext} from "../contexts";
import {useEditedPostCollection, useFullUserData, useSession} from "../hooks";
import * as ROUTES from "../constants/routes";
import {useHistory} from "react-router-dom";
import { collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import {firebaseDb} from "../Firebase";
import moment from "moment";
import Input from "../components/layout/input";
import * as interfaceStyles from "../constants/interfaceStyles";

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
    const [lastSavedTime, setLastSavedTime] = useState(null);
    const [isPostStructureDisplayed, setIsPostStructureDisplayed] = useState(false);
    const [hasNotNamedUser, setHasNotNamedUser] = useState(false);

    const [isComponentBuilt, setIsComponentBuilt] = useState(false);

    const [background, setBackground] = useState('white');

    const {isLoadingUserCollection, userCollection} = useFullUserData();
    const {isDraftCheckOver, docId: existingDocId, data} = useEditedPostCollection(isInitializing ? "" :
        user ? user.uid : "");

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

    const handleTitleChange = value => {
        if (!isDraftCheckOver || isPostBeingManipulated)
            return;

        setTitle(value);
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

        if (hasNotNamedUser)
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

    const postStructure = contentElements.map((element, index) => {
        const value = [];

        if (element.type === "add element")
            return null

        if (!element.value.length)
            return null;

        if (element.type === "video link")
            return null;

        if (element.type === "text")
            value.push(element.value);
        else if (element.type === "image link")
            value.push(<img src={element.value} className="img-fluid" alt="Element is not loaded" />);
        //else if (element.type === "video link")
        //value.push(element.value);

        return <p key={"element-" + index} className="card-text">{value[0]}</p>;
    });

    useEffect(() => {
        if (isDraftCheckOver) {
            return new Promise(resolve => {
                if (existingDocId) {
                    setDocId(existingDocId);
                    setTitle(data.title);
                    setContentElements(data.structure);
                }

                setTimeout(() => resolve(true), 2000);
            })
                .then(value => setIsComponentBuilt(value))
        }
    }, [data, existingDocId, isDraftCheckOver]);

    useEffect(() => {
        if (isTitleEmpty && isPostEmpty)
            return;

        if (isPostBeingManipulated)
            return;

        if (!isComponentBuilt)
            return;

        const {firstName, lastName, uid} = userDataRef.current;

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
                },
                comments: 0
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

                    setLastSavedTime(new Date());
                });
            else
                editPost().then(() => setLastSavedTime(new Date()));
        }
        catch (e) {

        }
    }, [title, contentElements]);

    useEffect(() => {
        if (!isLoadingUserCollection) {
            const component = interfaceStyles.NEW_POST
                .split(" ")
                .map((value, index) => {
                    if (index)
                        return value[0].toUpperCase() + value.slice(1);

                    return value;
                })
                .join("");

            const postElementStyles = userCollection['interfaceStyles'][component];

            const backgroundColor = postElementStyles['background'];

            setBackground(backgroundColor);

            if (userDataRef.current.firstName && userDataRef.current.lastName)
                setHasNotNamedUser(false);
            else
                setHasNotNamedUser(true);
        }
    }, [isLoadingUserCollection, userCollection]);

    if (isInitializing)
        return null;

    if (!isInitializing && !condition(user)) {
        history.push(ROUTES.SIGN_IN);

        return null;
    }

    return (
        <div className={`container-fluid py-5 min-vh-100 bg-${background}`}>
            <div className="row gy-3">
                <ElementCentered>
                    <Input
                        placeholder='Title of your post'
                        value={title}
                        onChange={handleTitleChange}/>
                </ElementCentered>

                {hasPostBeingPublished &&
                <ElementCentered>
                    <div className="alert alert-success mt-3" role="alert">{PUBLISH_POST_SUCCESS}</div>
                </ElementCentered>}

                {hasNotNamedUser &&
                <ElementCentered>
                    <div className="alert alert-danger mt-3" role="alert">
                        Impossible to publish post without any name
                    </div>
                </ElementCentered>}

                {contentElements.map((value, index) => {
                    return <Fragment key={"Add element " + index}>
                        <ElementCentered started={
                            <AddElementButton setState={setContentElements} array={contentElements} index={index}/>
                        }/>

                        <ElementCentered
                            started={<DraggableElement/>}
                            ended={
                                <DeleteElement
                                    setState={setContentElements}
                                    array={contentElements}
                                    index={index}/>}>
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
                        </ElementCentered>
                    </Fragment>
                })}

                <ElementCentered>
                    <PostElements setState={setContentElements} array={contentElements}/>
                </ElementCentered>

                <ElementCentered>
                    <div className="d-grid d-md-flex gap-2">
                        <PublishPost handleClick={handlePublishPost} text="Publish"/>

                        <DeletePost handleClick={handlePostDelete} text="delete the draft"/>

                        <button
                            type="button"
                            className="btn text-dark opacity-100"
                            disabled={true}>
                            {lastSavedTime ? moment(lastSavedTime).format("[Last saved] HH:mm") : ""}
                        </button>

                        <TogglePost
                            isPostStructureDisplayed={isPostStructureDisplayed}
                            onClick={() => setIsPostStructureDisplayed(!isPostStructureDisplayed)}/>
                    </div>
                </ElementCentered>

                {isPostStructureDisplayed &&
                <ElementCentered>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">{title}</h5>

                            {postStructure}
                        </div>
                    </div>
                </ElementCentered>}

                {//TODO tag list
                    }
                <div>
                    <datalist>
                        <option value="Edge" />
                    </datalist>
                </div>

                <ElementCentered
                    started={<DraggableElement/>}>
                    23
                </ElementCentered>

                <ElementCentered
                    started={<DraggableElement/>}>
                    67
                </ElementCentered>
            </div>
        </div>
    );
};

export default AddPost;