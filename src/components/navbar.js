import React, {useContext} from "react";
import UpperNavbar from "./navbar/upperNavbar";
import LowerNavbar from "./navbar/lowerNavbar";
import {IsInitializingContext} from "../contexts";
import {useSession} from "../hooks";

const Navbar = () => {
    const isInitializing = useContext(IsInitializingContext);
    const user = useSession();

    const condition = authUser => !!authUser;

    return <>
        <UpperNavbar />

        {!isInitializing && condition(user) &&
            <LowerNavbar/>
        }
    </>;
};

export default Navbar;