import React, {Fragment, useEffect, useRef, useState} from "react";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import {doc, updateDoc} from "firebase/firestore";
import {firebaseDb} from "../../Firebase";
import {useFullUserData, useSession} from "../../hooks";

const bootstrapColors = [
    "primary",
    "secondary",
    "success",
    "danger",
    "light",
    "white",
    "warning",
    "info",
    "dark"
];

const ColorRadio = ({interfaceStyle, type : fieldType = "background"}) => {
    const {isLoadingUserCollection, userCollection} = useFullUserData();

    const [color, setColor] = useState(bootstrapColors[0]);
    const [isMakingFetch, setIsMakingFetch] = useState(false);

    const isComponentMounted = useRef(false);
    const userUidRef = useRef("");
    const interfaceStyleRef = useRef(interfaceStyle);

    const user = useSession();

    const radioLabels = bootstrapColors.map(value => {
        const id = generateUniqueID();

        const handleColorChange = e => {
            if (!isMakingFetch && !isLoadingUserCollection)
                setColor(e.target.value);
        };

        if (interfaceStyle === "likeButtons" &&
            (value === "light" || value === "white")) {
            return false;
        }

        return <Fragment key={id}>
            <input
                autoComplete="off"
                className="btn-check"
                value={value}
                id={id}
                onClick={handleColorChange}
                type="radio"/>

            <label
                className={`btn rounded-circle p-3 btn-${color === value ? "outline-" : ""}${value}`}
                htmlFor={id}>
            </label>
        </Fragment>;
    });

    useEffect(() => {
        if (!isComponentMounted.current) {
            isComponentMounted.current = true;

            return;
        }

        if (!color)
            return;

        setIsMakingFetch(true);

        const setUserColorScheme = async () => {
            const styleField = interfaceStyleRef.current;

            const key = `interfaceStyles.${styleField}.${fieldType}`;

            const usersData = {

            };

            usersData[key] = color;

            const usersRef = doc(firebaseDb, "users", userUidRef.current);

            await updateDoc(usersRef, usersData);
        };

        setUserColorScheme().then(() => setIsMakingFetch(false));
    }, [color]);

    useEffect(() => {
        userUidRef.current = user.uid;
    }, [user]);

    useEffect(() => {
        if (!isLoadingUserCollection) {
            const elementStyles = userCollection['interfaceStyles'][interfaceStyle];

            const array = fieldType.split(".");
            const savedColor = (array.length === 1) ?
                elementStyles[fieldType] :
                array.reduce((previousValue, currentValue) => {
                    return elementStyles[previousValue][currentValue];
                });

            setColor(savedColor);
        }
    }, [interfaceStyle, isLoadingUserCollection, userCollection]);

    return (
        <div className="d-grid gap-2 d-md-flex">
            {radioLabels}
        </div>
    );
};

export default ColorRadio;