import React, {useContext, useState} from "react";
import {AuthUserContext} from "../../contexts";
import Input from "../layout/input";

const CONFIRM_TEXT = "Do you wish to update your account?";

const UserData = () => {
    const authUser = useContext(AuthUserContext);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleUserDataUpdate = e => {
        e.preventDefault();

        if (!window.confirm(CONFIRM_TEXT))
            return false;

        user.uid
    };

    return <>
        <Input id="firstName" value={firstName} placeholder="Type your first name" onChange={setFirstName}/>

        <Input id="lastName" value={lastName} placeholder="Type your last name" onChange={setLastName}/>

        <button type="button" className="btn btn-info mt-3" onClick={handleUserDataUpdate}>Update your data</button>
    </>;
};

export default UserData;