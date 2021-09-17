import {createContext} from "react";

export const IsInitializingContext = createContext(true);

export const UserContext = createContext({
    user: null
});

export const CommentsContext = createContext({});

export const UserCollectionContext = createContext({
    isLoadingUserCollection: true,
    userCollection: null
});