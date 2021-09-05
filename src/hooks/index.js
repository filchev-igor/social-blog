import {useContext, useEffect, useState} from "react";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {UserContext} from "../contexts";
import { doc, onSnapshot, query, collection, where, getDocs, orderBy, limit } from "firebase/firestore";
import {firebaseDb} from "../Firebase";

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
}

export const useUserCollection = uid => {
    const [state, setState] = useState({
        isLoadingUserCollection: true,
        userCollection: null
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
        data: null
    });    

    useEffect(() => {
        const getEditedPost = async() => {
            const arrayId = [];
            const arrayData = [];

            try {
                const postsRef = collection(firebaseDb, "posts");

                const queryRef = query(
                    postsRef,
                    where("creator.uid", "==", uid),
                    where("isPublished", "==", false));

                const querySnapshot = await getDocs(queryRef);

                querySnapshot.forEach(doc => {
                    arrayId.push(doc.id);
                    arrayData.push(doc.data());
                });
            }
            catch (e) {

            }

            return {
                arrayId, arrayData
            };
        }
        
        getEditedPost().then(({arrayId, arrayData}) => setState({
            isDraftCheckOver: true,
            docId: arrayId[0],
            data: arrayData[0]
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

        const unsibscribe = onSnapshot(queryRef, querySnapshot => {
            const posts = [];

            querySnapshot.forEach(doc => {
                const created = doc.data().dates.created;
                const published = doc.data().dates.published;

                const object = {
                    id : doc.id,
                    data : doc.data()
                };

                object.data.dates.created = new Date(Number(created));
                object.data.dates.published = new Date(Number(published));

                posts.push(object);
            });

            setState(posts);
        })

        return () => unsibscribe();
    }, []);

    return state;
};