import {useParams} from "react-router-dom";
import React from "react";
import AccountSettings from "./accountSettings";
import UserData from "./userData";
import InterfaceSettings from "./interfaceSettings";

const componentsMap = new Map();

componentsMap
    .set("user-data", <UserData />)
    .set("account-settings", <AccountSettings />)
    .set("interface-settings", <InterfaceSettings />);

const AccountPage = () => {
    const {pageId} = useParams();

    const [firstComponent] = componentsMap.values();

    return componentsMap.get(pageId) || firstComponent;
};

export default AccountPage;