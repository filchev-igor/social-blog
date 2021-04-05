import React, {useContext} from "react";
import {AuthUserContext} from "../contexts";
import UpperNavbar from "./navbar/upperNavbar";
import LowerNavbar from "./navbar/lowerNavbar";

const Navbar = () => {
    const authUser = useContext(AuthUserContext);

    const condition = authUser => !!authUser;

    if (!condition(authUser))
        return <UpperNavbar />;

    return <>
        <UpperNavbar />

        <LowerNavbar />
    </>;
};

export default Navbar;