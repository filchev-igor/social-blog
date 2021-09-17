import InterfaceCard from "./interfaceCard";
import React from "react";
import interfaceStyles from "../../constants/interfaceStyles";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";

const InterfaceSettings = () => {
    return interfaceStyles.map(element => {
        const key = generateUniqueID();

        return <InterfaceCard key={key} interfaceStyle={element}/>
    });
};

export default InterfaceSettings;