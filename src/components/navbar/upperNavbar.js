import logo from "../../img/logo.png";
import React, {useEffect, useState} from "react";
import {useFullUserData} from "../../hooks";
import {UPPER_NAVBAR} from "../../constants/interfaceStyles";

const UpperNavbar = () => {
    const {isLoadingUserCollection, userCollection} = useFullUserData();

    const [color, setColor] = useState('light');
    const [isLightColorScheme, setIsLightColorScheme] = useState(true);
    
    useEffect(() => {
        if (!isLoadingUserCollection) {
            const component = UPPER_NAVBAR
                .split(" ")
                .map((value, index) => {
                    if (index)
                        return value[0].toUpperCase() + value.slice(1);
                    
                    return value;
                })
                .join("");
            
            const elementStyles = userCollection['interfaceStyles'][component];
            
            setColor(elementStyles['background']);
            setIsLightColorScheme(elementStyles['isLightColorScheme']);
        }
    }, [isLoadingUserCollection, userCollection]);

    return (
        <nav aria-label="Hidden navigation during scrolling"
             className={`bg-${color} bg-gradient navbar 
             navbar-${isLightColorScheme ? "light" : "dark"} navbar-expand-md pt-0`}
             id="firstNavbarConsumer">
            <div className="container-fluid">
                <div className="collapse navbar-collapse pt-2">
                    <ul className="navbar-nav align-items-center w-100 justify-content-center">
                        <li className="nav-item">
                            <img alt="Website icon" src={logo} style={{width: "4rem", height: "4rem"}}/>
                        </li>

                        <li className="nav-item">
                            <span className="nav-link display-6 text-uppercase">
                                social blog
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default UpperNavbar;