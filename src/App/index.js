import React, {useEffect, useRef, useState} from "react";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Navbar from '../components/navbar';
import * as ROUTES from '../constants/routes';
import Home from "./home";
import SignIn from "./signIn";
import SignUp from "./signUp";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import PageDoesNotExist from "./404";
import PasswordForget from "./passwordForget";
import Account from "./account";
import {AuthUserContext, IsAuthUserLoadingContext} from "../contexts";
import Admin from "./admin";
import {firebaseAuth, firebaseFirestore} from "../Firebase";
import AddPost from "./addPost";

const App = () => {
    const [authUser, setAuthUser] = useState(null);
    const [isAuthUserLoading, setIsAuthUserLoading] = useState(true);

    const authUserRef = useRef(authUser);
    const authUserUid = authUser ? authUser.uid : null;

    useEffect(() => {
        const authObserver = firebaseAuth.onAuthStateChanged(user => {
            const updatedAuthUser = user === null ? null : {...authUserRef.current, ...user};

            setAuthUser(updatedAuthUser);

            setIsAuthUserLoading(false);
            
            authUserRef.current = updatedAuthUser;
        });

        return () => authObserver();
    }, []);
    
    useEffect(() => {
        if (authUserUid) {
            const firestoreOnSnapshot = firebaseFirestore.collection("users").doc(authUserUid)
                .onSnapshot(doc => {
                    const updatedAuthUser = {...authUserRef.current, ...doc.data()};

                    setAuthUser(updatedAuthUser);

                    authUserRef.current = updatedAuthUser;
                });

            return () => firestoreOnSnapshot();
        }
    }, [authUserUid]);

    return (
        <Router>
            <AuthUserContext.Provider value={authUser}>
                <IsAuthUserLoadingContext.Provider value={isAuthUserLoading}>
                    <Navbar/>

                    <Switch>
                        <Route exact path={ROUTES.HOME}>
                            <Home/>
                        </Route>
                        <Route path={ROUTES.SIGN_IN}>
                            <SignIn/>
                        </Route>
                        <Route path={ROUTES.SIGN_UP}>
                            <SignUp/>
                        </Route>
                        <Route path={ROUTES.ACCOUNT}>
                            <Account/>
                        </Route>
                        <Route path={ROUTES.ADMIN}>
                            <Admin/>
                        </Route>
                        <Route path={ROUTES.PASSWORD_FORGET}>
                            <PasswordForget/>
                        </Route>
                        <Route path={ROUTES.ADD_POST}>
                            <AddPost/>
                        </Route>
                        <Route path="*">
                            <PageDoesNotExist/>
                        </Route>
                    </Switch>
                </IsAuthUserLoadingContext.Provider>
            </AuthUserContext.Provider>
        </Router>
    );
}

export default App;
