import React from "react";
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
import Admin from "./admin";
import AddPost from "./addPost";
import {useAuth} from "../hooks";
import {IsInitializingContext, UserContext} from "../contexts";
import Post from "./post";

const App = () => {
    const {isInitializing, user} = useAuth();

    return (
        <Router>
            <UserContext.Provider value={{user}}>
                <IsInitializingContext.Provider value={isInitializing}>
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
                        <Route path={ROUTES.POST}>
                            <Post/>
                        </Route>
                        <Route path="*">
                            <PageDoesNotExist/>
                        </Route>
                    </Switch>
                </IsInitializingContext.Provider>
            </UserContext.Provider>
        </Router>
    );
}

export default App;
