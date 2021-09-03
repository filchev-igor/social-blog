import React from "react";
import { getAuth, signOut } from "firebase/auth";

const LogoutButton = () => {
    const auth = getAuth();

    const handleLogOut = () => signOut(auth);

    return (
        <button className="btn btn-outline-danger" onClick={handleLogOut}>Log out</button>
    );
};

export default LogoutButton;