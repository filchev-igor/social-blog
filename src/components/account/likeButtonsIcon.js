import {useFullUserData, useSession} from "../../hooks";
import React, {useEffect, useRef, useState} from "react";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import {doc, updateDoc} from "firebase/firestore";
import {firebaseDb} from "../../Firebase";

const icons = [
    "hand-thumbs",
    "caret",
    "chevron",
    "arrow",
    "arrow-bar"
];

const LikeButtonsIcon = ({type = "like"}) => {
    const {isLoadingUserCollection, userCollection} = useFullUserData();

    const [color, setColor] = useState(type === "like" ? "success" : "dislike");
    const [iconName, setIconName] = useState(icons[0]);
    const [isMakingFetch, setIsMakingFetch] = useState(false);

    const isComponentMounted = useRef(false);
    const userUidRef = useRef("");

    const user = useSession();

    const radioLabels = icons.map(value => {
        const id = generateUniqueID();

        const handleIconChange = () => {
            if (!isMakingFetch && !isLoadingUserCollection)
                setIconName(value);
        };

        const outline = iconName !== value ? "outline-" : "";

        return (
            <button key={id}
                type="button"
                className={`btn btn-${outline}${color === "white" ? "light" : color}`}
                onClick={handleIconChange}>
                <i className={`bi bi-${value}-${type === "like" ? "up" : "down"}`}>

                </i>
            </button>
        );
    });

    useEffect(() => {
        if (!isComponentMounted.current) {
            isComponentMounted.current = true;

            return;
        }

        if (!iconName)
            return;

        setIsMakingFetch(true);

        const fetchLikeIcon = async () => {
            const key = `interfaceStyles.likeButtons.${type}.icon`;

            const usersData = {

            };

            usersData[key] = iconName;

            const usersRef = doc(firebaseDb, "users", userUidRef.current);

            await updateDoc(usersRef, usersData);
        };

        fetchLikeIcon().then(() => setIsMakingFetch(false));
    }, [iconName]);

    useEffect(() => {
        userUidRef.current = user.uid;
    }, [user]);

    useEffect(() => {
        if (!isLoadingUserCollection) {
            const icon = userCollection['interfaceStyles']['likeButtons'][type]['icon'];
            const background = userCollection['interfaceStyles']['likeButtons'][type]['background'];

            setIconName(icon);
            setColor(background);
        }
    }, [isLoadingUserCollection, userCollection]);

    return (
        <div className="gap-2 d-flex">{radioLabels}</div>
    );
};

export default LikeButtonsIcon;