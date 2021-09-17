import InterfaceCard from "./interfaceCard";
import React from "react";
import interfaceStyles from "../../constants/interfaceStyles";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";

const InterfaceSettings = () => {
    return interfaceStyles.map(element => {
        const key = generateUniqueID();

        return <InterfaceCard key={key} interfaceStyle={element}/>
    });

    /*
    return <>
        <InterfaceCard interfaceStyles={interfaceStyles.}/>
        <div>
            <p>Upper navbar</p>
            <p>Lower navbar</p>
            <p>Page background</p>
            <p>Home page post styles</p>
            <p>Post page styles</p>
            <p>Comments styles</p>
            <p>Create new post styles</p>
        </div>
    </>;
         */
};

export default InterfaceSettings;