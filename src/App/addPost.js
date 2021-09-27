import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import {ElementCentered} from "../components/addPost/elements";
import {IsInitializingContext} from "../contexts";
import {useEditedPostCollection, useFullUserData, useSession} from "../hooks";
import * as ROUTES from "../constants/routes";
import {useHistory} from "react-router-dom";
import { collection, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import {firebaseDb} from "../Firebase";
import moment from "moment";
import * as interfaceStyles from "../constants/interfaceStyles";
import DraftLayout from "../components/addPost/draftLayout";
import {DELETE_DRAFT, INTRODUCE_YOURSELF, PUBLISH_POST, PUBLISH_POST_SUCCESS} from "../constants";
import DeleteDraft from "../components/addPost/deleteDraft";
import Input from "../components/layout/input";
import useDraftLayout from "../hooks/useDraftLayout";

const AddPost = () => {
    const isInitializing = useContext(IsInitializingContext);
    const user = useSession();

    const [title, setTitle] = useState('');
    const [docId, setDocId] = useState(null);
    const [lastSavedTime, setLastSavedTime] = useState(null);
    const [background, setBackground] = useState('white');
    const [isPostPublished, setIsPostPublished] = useState(false);

    const {isLoadingUserCollection, userCollection} = useFullUserData();
    const {
        isDraftCheckOver,
        docId : existingDocId,
        title : existingTitle,
        postLayout : existingPostLayout
    } = useEditedPostCollection(user?.uid ?? "");

    const userDataRef = useRef({
        firstName: "",
        lastName: "",
        uid: null
    });
    const isPostBeingManipulated = useRef(false);

    userDataRef.current.firstName = userCollection.name.first;
    userDataRef.current.lastName = userCollection.name.last;
    userDataRef.current.uid = user?.uid ?? null;
    
    const {state : postLayout, dispatch : dispatchPostLayout} = useDraftLayout();

    const hasUserCalledHimself = useMemo(() => !!userCollection.name.first && !!userCollection.name.last,
        [userCollection.name.first, userCollection.name.last]);

    const history = useHistory();

    const condition = authUser => !!authUser;

    const handleTitleChange = value => {
        if (isPostBeingManipulated.current)
            return;

        setTitle(value);
    };

    const handleDraftDelete = () => {
        if (!title.length && !postLayout.length)
            return;

        if (!window.confirm(DELETE_DRAFT))
            return;

        isPostBeingManipulated.current = true;

        (async() => {
            const usersData = {
                hasDraft: false
            };

            await deleteDoc(doc(firebaseDb, "posts", docId));

            const usersRef = doc(firebaseDb, "users", user.uid);

            await updateDoc(usersRef, usersData);
        })().then(() => {
            setTitle('');
            dispatchPostLayout({type: "reset layout"});
            setDocId(null);

            isPostBeingManipulated.current = false;
        });
    };

    const handlePublishPost = () => {
        if (!title.length || !postLayout.length)
            return;

        if (!window.confirm(PUBLISH_POST))
            return;

        isPostBeingManipulated.current = true;

        (async () => {
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
            dispatchPostLayout({type: "reset layout"});
            setDocId(null);

            isPostBeingManipulated.current = false;
            setIsPostPublished(true);
        });
    };

    useEffect(() => {
        if (existingDocId) {
            new Promise(resolve => {
                isPostBeingManipulated.current = true;

                setDocId(existingDocId);
                setTitle(existingTitle);
                dispatchPostLayout({type: "set layout", array: existingPostLayout});

                setTimeout(() => resolve(), 2000);
            })
                .then(() => isPostBeingManipulated.current = false);
        }
    }, [dispatchPostLayout, existingDocId, existingPostLayout, existingTitle]);

    useEffect(() => {
        const isDraftEmpty = !title.length && !postLayout.length;

        if (isDraftEmpty)
            return;

        if (isPostBeingManipulated.current)
            return;

        const {firstName, lastName, uid} = userDataRef.current;

        const createPost = async() => {
            isPostBeingManipulated.current = true;

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
                structure: postLayout,
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

            const usersRef = doc(firebaseDb, "users", uid);

            await updateDoc(usersRef, usersData);

            setDocId(postRef.id);
        };

        const editPost = async() => {
            const docData = {
                title: title,
                structure: postLayout
            };

            const docRef = doc(firebaseDb, "posts", docId);

            await updateDoc(docRef, docData);
        };

        if (!docId) {
            createPost().then(() => {
                isPostBeingManipulated.current = false;
                setIsPostPublished(false);

                setLastSavedTime(new Date());
            });
        }
        else {
            editPost().then(() => setLastSavedTime(new Date()));
        }

    }, [title, postLayout, docId]);

    /*
    *Code in the useEffect gets styles from database and applies them to the page
     */
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
        }
    }, [isLoadingUserCollection, userCollection]);

    if (isInitializing)
        return null;

    if (!isInitializing && !condition(user)) {
        history.push(ROUTES.SIGN_IN);

        return null;
    }

    if (!isDraftCheckOver)
        return null;

    if (!hasUserCalledHimself) {
        return (
            <div className={`container-fluid py-5 min-vh-100 bg-${background}`}>
                <div className="row gy-3">
                    <ElementCentered>
                        <div className="alert alert-danger mt-3" role="alert">
                            {INTRODUCE_YOURSELF}
                        </div>
                    </ElementCentered>
                </div>
            </div>
        );
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

                <DraftLayout state={postLayout} dispatch={dispatchPostLayout}/>

                <ElementCentered>
                    <div className="d-grid d-md-flex gap-2">
                        <button
                            className={`btn btn-outline-primary ${!postLayout.length ? "invisible" : ""}`}
                            onClick={handlePublishPost}>
                            {PUBLISH_POST}
                        </button>

                        <DeleteDraft handleDraftDelete={handleDraftDelete} isInvisible={!postLayout.length}/>

                        <button
                            type="button"
                            className="btn text-dark opacity-100"
                            disabled={true}>
                            {lastSavedTime ? moment(lastSavedTime).format("[Last saved] HH:mm") : ""}
                        </button>
                    </div>
                </ElementCentered>

                {isPostPublished &&
                <ElementCentered>
                    <div className="alert alert-success mt-3" role="alert">{PUBLISH_POST_SUCCESS}</div>
                </ElementCentered>}
            </div>
        </div>
    );
};

export default AddPost;