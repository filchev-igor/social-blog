import React, {useEffect, useRef, useState} from "react";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import {doc, updateDoc} from "firebase/firestore";
import {firebaseDb} from "../../Firebase";
import {useFullUserData, useSession} from "../../hooks";

const ColorSchemeSwitcher = ({interfaceStyle}) => {
    const {isLoadingUserCollection, userCollection} = useFullUserData();

    const [isLightColorScheme, setIsLightColorScheme] = useState(true);
    const [isMakingFetch, setIsMakingFetch] = useState(false);

    const isComponentMounted = useRef(false);
    const userUidRef = useRef("");
    const interfaceStyleRef = useRef(interfaceStyle);

    const user = useSession();

    const id = generateUniqueID();

    const toggleColorScheme = e => {
        if (!isMakingFetch && !isLoadingUserCollection)
            setIsLightColorScheme(e.target.checked);
    }

    useEffect(() => {
        if (!isComponentMounted.current) {
            isComponentMounted.current = true;

            return;
        }

        setIsMakingFetch(true);

        const setUserColorScheme = async () => {
            const styleField = interfaceStyleRef.current;

            const key = `interfaceStyles.${styleField}.isLightColorScheme`;

            const usersData = {

            };

            usersData[key] = isLightColorScheme;

            const usersRef = doc(firebaseDb, "users", userUidRef.current);

            await updateDoc(usersRef, usersData);
        };

        setUserColorScheme().then(() => setIsMakingFetch(false));
    }, [isLightColorScheme]);

    useEffect(() => {
        userUidRef.current = user.uid;
    }, [user]);

    useEffect(() => {
        if (!isLoadingUserCollection) {
            const elementStyles = userCollection['interfaceStyles'][interfaceStyle];

            setIsLightColorScheme(elementStyles['isLightColorScheme']);
        }
    }, [interfaceStyle, isLoadingUserCollection, userCollection]);

    return (
        <div className="form-check form-switch">
            <input
                className="form-check-input"
                id={id}
                type="checkbox"
                onChange={toggleColorScheme}
                checked={isLightColorScheme}/>
            <label className="form-check-label" htmlFor={id}

            >{isLightColorScheme ? "Light" : "Dark"} scheme is active</label>
        </div>
    );
};

export default ColorSchemeSwitcher;