import React, {useContext} from "react";
import {AuthUserContext} from "../contexts";
import UpperNavbar from "./navbar/upperNavbar";
import LowerNavbar from "./navbar/lowerNavbar";

const Navbar = () => {
    const authUser = useContext(AuthUserContext);

    const condition = authUser => !!authUser;

    //console.log(authUser);
    //console.log(condition(authUser));

    return <>
        <UpperNavbar />

        {condition(authUser) &&
            <LowerNavbar/>
        }
    </>;
};

export default Navbar;