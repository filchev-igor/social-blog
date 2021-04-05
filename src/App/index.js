import React, {useEffect, useState} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import Navbar from '../components/navbar';
import * as ROUTES from '../constants/routes';
import Home from "./home";
import SignIn from "./signIn";
import SignUp from "./signUp";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import firebaseAuth from "../Firebase";
import PageDoesNotExist from "./404";
import PasswordForget from "./passwordForget";
import Account from "./account";
import {AuthUserContext} from "../contexts";

const App = () => {
    const [authUser, setAuthUser] = useState('halt execution');

    useEffect(() => {
        const userObserver = firebaseAuth.onAuthStateChanged(user => setAuthUser(user));

        return () => userObserver();
    }, []);

    return (
        <Router>
            <AuthUserContext.Provider value={authUser}>
                <Navbar />

                <Switch>
                    <Route exact path={ROUTES.HOME}>
                        {authUser ? <Home/> : <Redirect to={ROUTES.SIGN_IN}/>}
                    </Route>
                    <Route path={ROUTES.SIGN_IN}>
                        {authUser ? <Redirect to={ROUTES.HOME} /> : <SignIn authUser={authUser} />}
                    </Route>
                    <Route path={ROUTES.SIGN_UP}>
                        {authUser ? <Redirect to={ROUTES.HOME} /> : <SignUp />}
                    </Route>
                    <Route path={ROUTES.ACCOUNT}>
                        {authUser ?

                                <Account />
                            :
                            <Redirect to={ROUTES.SIGN_IN}/>}
                    </Route>
                    <Route path={ROUTES.ADMIN}>
                        {authUser ? '' : <Redirect to={ROUTES.SIGN_IN}/>}
                    </Route>
                    <Route path={ROUTES.PASSWORD_FORGET}>
                        {authUser ? <Redirect to={ROUTES.HOME} /> : <PasswordForget />}
                    </Route>
                    <Route path="*">
                        {authUser ? <PageDoesNotExist /> : <Redirect to={ROUTES.SIGN_IN}/>}
                    </Route>
                </Switch>
            </AuthUserContext.Provider>
        </Router>
    );
}

export default App;
