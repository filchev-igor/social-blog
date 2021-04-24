import React from "react";
import {firebaseAuth} from "../Firebase";

const LogoutButton = () => {
    const handleLogOut = () => firebaseAuth.signOut();

    return (
        <button className="btn btn-outline-danger" onClick={handleLogOut}>Log out</button>
    );
};

export default LogoutButton;