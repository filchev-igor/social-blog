import {LabeledInput} from "../globalLayout";
import React, {useContext, useState} from "react";
import {AuthUserContext} from "../../contexts";

const UserData = () => {
    const authUser = useContext(AuthUserContext);

    const [email, setEmail] = useState(authUser.email);

    return <>
        <LabeledInput type="email" id="e-mail" value={email} placeholder="Type new e-mail" onChange={setEmail}/>
    </>;
};

export default UserData;