import React, {useEffect, useState} from "react";
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
import {AuthUserContext} from "../contexts";
import Admin from "./admin";
import {firebaseAuth, firebaseFirestore} from "../Firebase";

const App = () => {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const userObserver = firebaseAuth.onAuthStateChanged(
            user => {
                setAuthUser(user);

                if (user) {
                    firebaseFirestore.collection("users").doc(user.uid)
                        .onSnapshot(doc => setAuthUser({...user, ...doc.data()}));
                }
            }
        );

        return () => userObserver();
    }, []);

    return (
        <Router>
            <AuthUserContext.Provider value={authUser}>
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
                    <Route path="*">
                        <PageDoesNotExist/>
                    </Route>
                </Switch>
            </AuthUserContext.Provider>
        </Router>
    );
}

export default App;
