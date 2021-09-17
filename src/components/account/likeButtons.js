import {useFullUserData, useSession} from "../../hooks";
import React, {Fragment, useEffect, useRef, useState} from "react";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import {doc, updateDoc} from "firebase/firestore";
import {firebaseDb} from "../../Firebase";

const icons = [
    "hand-thumbs",
    "caret",
    "chevron"
];

const LikeButtons = ({type = "like"}) => {
    const {isLoadingUserCollection, userCollection} = useFullUserData();

    const [iconName, setIconName] = useState(icons[0]);
    const [isMakingFetch, setIsMakingFetch] = useState(false);

    const isComponentMounted = useRef(false);
    const userUidRef = useRef("");

    const user = useSession();

    const radioLabels = icons.map((value, index) => {
        const id = generateUniqueID();

        const handleIconChange = e => {
            if (!isMakingFetch && !isLoadingUserCollection)
                setIconName(e.target.value);
        };

        const outline = iconName === value ? "outline-" : "";
        const color = type === "like" ? "success" : "danger";

        return (
            <button key={id}
                type="button"
                className={`btn btn-${isPressed ? "" : "outline-"}success`}
                onClick={handleIconChange}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonRelease}>
                <i className={`bi bi-hand-thumbs-up${isHovered ? "-fill" : ""}`}>

                </i>
            </button>
        );
        return <Fragment key={id}>
            <input
                autoComplete="off"
                className="btn-check"
                value={value}
                id={id}
                onClick={handleIconChange}
                type="radio"/>

            <label
                className={`btn rounded-circle p-3 btn-${outline}${color}`}
                htmlFor={id}>
            </label>
        </Fragment>;
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
            const key = `interfaceStyles.${type}.icon`;

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

            setIconName(icon);
        }
    }, [isLoadingUserCollection, userCollection]);

    return (
        <div className="gap-2 d-flex">
            {radioLabels}
        </div>
    );
};

export default LikeButtons;