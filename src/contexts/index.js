import {createContext} from "react";

export const IsInitializingContext = createContext(true);

export const UserContext = createContext({
    user: null
});

export const CommentsNumberContext = createContext(0);