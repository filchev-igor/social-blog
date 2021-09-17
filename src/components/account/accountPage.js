import {useParams} from "react-router-dom";
import React from "react";
import AccountSettings from "./accountSettings";
import UserData from "./userData";
import InterfaceSettings from "./interfaceSettings";
import ResetAccount from "./resetAccount";
import PageDoesNotExist from "../../App/404";

const componentsMap = new Map();

componentsMap
    .set("user-data", <UserData/>)
    .set("account-settings", <AccountSettings/>)
    .set("interface-settings", <InterfaceSettings/>)
    .set("reset-account", <ResetAccount/>);

const AccountPage = () => {
    const {pageId} = useParams();

    if (componentsMap.get(pageId))
        return componentsMap.get(pageId)
    else
        return <PageDoesNotExist/>;
};

export default AccountPage;