import {Link, useLocation} from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import LogoutButton from "../logoutButton";
import React, {useEffect, useState} from "react";
import {useFullUserData} from "../../hooks";
import * as ROLES from "../../constants/roles";
import {LOWER_NAVBAR} from "../../constants/interfaceStyles";

const LowerNavbar = () => {
    const {isLoadingUserCollection, userCollection} = useFullUserData();

    const [backgroundColor, setBackgroundColor] = useState('light');
    const [isLightColorScheme, setIsLightColorScheme] = useState(true);
    const [logoutColor, setLogoutColor] = useState('danger');

    const location = useLocation();

    useEffect(() => {
        if (!isLoadingUserCollection) {
            const component = LOWER_NAVBAR
                .split(" ")
                .map((value, index) => {
                    if (index)
                        return value[0].toUpperCase() + value.slice(1);

                    return value;
                })
                .join("");

            const elementStyles = userCollection['interfaceStyles'][component];

            const elementBackground = elementStyles['background'];
            const isLight = elementStyles['isLightColorScheme'];
            const buttonColor = elementStyles['logoutButtonColor'];

            setBackgroundColor(elementBackground);
            setIsLightColorScheme(isLight);
            setLogoutColor(buttonColor);
        }
    }, [isLoadingUserCollection, userCollection]);

    return <nav aria-label="Main navigation"
         className={`navbar navbar-expand-md bg-gradient sticky-top shadow-sm
         bg-${backgroundColor} navbar-${isLightColorScheme ? "light" : "dark"} `}>
        <div className="container-fluid">
            <button aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"
                    className="navbar-toggler"
                    data-bs-target="#navbarNav" data-bs-toggle="collapse" type="button">
                        <span className="navbar-toggler-icon">

                        </span>
            </button>

            <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                <ul className="navbar-nav text-uppercase">
                    <li className="nav-item">
                        <Link
                            className={`nav-link ${location.pathname === ROUTES.HOME ? "active" : ""}`}
                            to={ROUTES.HOME}>Home</Link>
                    </li>

                    <li className="nav-item">
                        <Link
                            className={`nav-link ${location.pathname === ROUTES.ADD_POST ? "active" : ""}`}
                                to={ROUTES.ADD_POST}>Add post</Link>
                    </li>

                    <li className="nav-item">
                        <Link
                            className={`nav-link ${location.pathname.includes(ROUTES.ACCOUNT) ? "active" : ""}`}
                            to={ROUTES.ACCOUNT}>Account</Link>
                    </li>

                    {!isLoadingUserCollection && userCollection.role === ROLES.ADMIN &&
                    <li className="nav-item">
                        <Link
                            className={`nav-link ${location.pathname === ROUTES.STATISTICS ? "active" : ""}`}
                            to={ROUTES.STATISTICS}>STATISTICS</Link>
                    </li>}

                    <li className="nav-item">
                        <LogoutButton color={logoutColor}/>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
};

export default LowerNavbar;