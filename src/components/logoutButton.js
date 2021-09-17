import React from "react";
import { getAuth, signOut } from "firebase/auth";

const LogoutButton = ({color}) => {
    const auth = getAuth();

    const handleLogOut = () => signOut(auth);

    return (
        <button className={`btn btn-outline-${color}`} onClick={handleLogOut}>Log out</button>
    );
};

export default LogoutButton;