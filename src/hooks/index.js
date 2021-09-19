import {useContext, useEffect, useState} from "react";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {UserCollectionContext, UserContext} from "../contexts";
import { doc, onSnapshot, query, collection, where, getDocs, orderBy, limit } from "firebase/firestore";
import {firebaseDb} from "../Firebase";
import * as moment from "moment";

export const useSession = () => {
    const {user} = useContext(UserContext);

    return user;
};

export const useAuth = () => {
    const [state, setState] = useState(() => {
        const auth = getAuth();

        const user = auth.currentUser;

        return {
            isInitializing: !user,
            user
        };
    });

    const onChange = user => setState({
        isInitializing: false,
        user
    });

    useEffect(() => {
        const auth = getAuth();

        const authObserver = onAuthStateChanged(auth, onChange);

        return () => authObserver();
    }, []);

    return state;
};

export const useFullUserData = () => {
    const {isLoadingUserCollection, userCollection} = useContext(UserCollectionContext);

    return {
        isLoadingUserCollection,
        userCollection
    };
};

export const useUserCollection = uid => {
    const [state, setState] = useState({
        isLoadingUserCollection: true,
        userCollection: {
            name: {
                first: '',
                last: ''
            }
        }
    });

    const onChange = doc => setState({
        isLoadingUserCollection: false,
        userCollection: doc.data()
    });

    useEffect(() => {
        if (uid) {
            const unsubscribe = onSnapshot(doc(firebaseDb, "users", uid), onChange);

            return () => unsubscribe();
        }
    }, [uid]);
    
    return state;
};

export const useEditedPostCollection = uid => {
    const [state, setState] = useState({
        isDraftCheckOver: false,
        docId: null,
        title: null,
        structure: null
    });    

    useEffect(() => {
        const getEditedPost = async() => {
            const obj = {
                docId: null,
                title: null,
                structure: null
            };

            const postsRef = collection(firebaseDb, "posts");

            const q = query(
                postsRef,
                where("creator.uid", "==", uid),
                where("isPublished", "==", false)
            );

            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(doc => {
                obj["docId"] = doc.id;
                obj["title"] = doc.data().title;
                obj["structure"] = doc.data().structure;
            });

            return obj;
        }
        
        getEditedPost().then(obj => setState({
            isDraftCheckOver: true,
            docId: obj.docId,
            title: obj.title,
            postLayout: obj.structure
        }));
    }, [uid]);

    return state;
};

export const usePostsCollection = () => {
    const [state, setState] = useState([]);

    useEffect(() => {
        const postsRef = collection(firebaseDb, "posts");

        const queryRef = query(
            postsRef,
            where("isPublished", "==", true),
            orderBy("dates.published", "desc"),
            limit(20));

        const unsubscribe = onSnapshot(queryRef, querySnapshot => {
            const posts = [];

            querySnapshot.forEach(doc => {
                const data = doc.data();

                const creationDate = new Date(data.dates.created.seconds * 1000);
                const publishingDate = new Date(data.dates.published.seconds * 1000);

                const obj = {
                    id : doc.id,
                    data : data
                };

                obj.data.dates.created = moment(creationDate).fromNow();
                obj.data.dates.published = moment(publishingDate).fromNow();

                posts.push(obj);
            });

            setState(posts);
        });

        return () => unsubscribe();
    }, []);

    return state;
};

export const useAllUsersCollection = () => {
    const [state, setState] = useState([]);

    useEffect(() => {
        const q = query(collection(firebaseDb, "users"), where("role", "==", "user"));
        const unsubscribe = onSnapshot(q, querySnapshot => {
            const users = [];

            querySnapshot.forEach(doc => {
                const obj = doc.data();

                obj.uid = doc.id;

                users.push(obj);
            });

            setState(users);
        });

        return () => unsubscribe();
    }, []);

    return state;
};

export const useUserPostsId = uid => {
    const [state, setState] = useState([]);

    useEffect(() => {
        (async () => {
            const array = [];
            
            const q = query(collection(firebaseDb, "posts"), where("creator.uid", "==", uid));

            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(doc => array.push(doc.id));
            
            return array;
        })().then(array => setState(array));
    }, [uid]);

    return state;
};

export const usePost = postId => {
    const inputData = {
        firstName: '',
        lastName: '',
        creatorUid: "",
        date: '',
        title: '',
        rating: '',
        structure: [],
        likedBy: {
            negatively: [],
            positively: []
        },
        comments: 0
    };

    const [state, setState] = useState({
        isPostChecking: true,
        isPostExisting: false,
        data: inputData
    });

    useEffect(() => {
        const obj = {
            firstName: '',
            lastName: '',
            creatorUid: "",
            date: '',
            title: '',
            rating: '',
            structure: [],
            likedBy: {
                negatively: [],
                positively: []
            },
            comments: 0
        };

        const postsRef = doc(firebaseDb, "posts", postId);

        const unsubscribe = onSnapshot(postsRef, doc => {
            const data = doc.data();

            if (data && data.isPublished) {
                const date = new Date(data.dates.published.seconds * 1000);

                obj.firstName = data.creator.first;
                obj.lastName = data.creator.last;
                obj.creatorUid = data.creator.uid;
                obj.date = moment(date).fromNow();
                obj.title = data.title;
                obj.rating = data.rating;
                obj.structure = data.structure;
                obj.likedBy.negatively = data.likedBy.negatively;
                obj.likedBy.positively = data.likedBy.positively;
                obj.comments = data.comments;
            }

            setState({
                isPostChecking: false,
                isPostExisting: !!data && data.isPublished,
                data: obj
            });
        });

        return () => unsubscribe();
    }, [postId]);

    return state;
};

export const useCommentsCollection = postId => {
    const [state, setState] = useState([]);

    useEffect(() => {
        const commentsRef = collection(firebaseDb, "comments");

        const queryRef = query(
            commentsRef,
            where("postId", "==", postId),
            orderBy("answerRiver.rootCommentId"),
            orderBy("date"),
            limit(20));

        const unsubscribe = onSnapshot(queryRef, querySnapshot => {
            const comments = [];

            querySnapshot.forEach(doc => {
                const data = doc.data();

                const object = {
                    id : doc.id,
                    data : data
                };

                const date = new Date(data.date.seconds * 1000);

                object.data.date = moment(date).fromNow();

                comments.push(object);
            });

            setState(comments);
        });

        return () => unsubscribe();
    }, [postId]);

    return state;
};

export const useUserCommentsId = uid => {
    const [state, setState] = useState([]);

    useEffect(() => {
        (async () => {
            const array = [];

            const q = query(collection(firebaseDb, "comments"), where("commentator.uid", "==", uid));

            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(doc => array.push(doc.id));

            return array;
        })().then(array => setState(array));
    }, [uid]);

    return state;
};