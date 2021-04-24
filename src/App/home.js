import React, {useContext, useEffect} from "react";
import {AuthUserContext} from "../contexts";
import * as ROUTES from '../constants/routes';
import {useHistory} from "react-router-dom";

const Home = () => {
    const authUser = useContext(AuthUserContext);

    const history = useHistory();

    const condition = authUser => !!authUser;

    useEffect(() => {

    }, []);

    if (!condition(authUser)) {
        //history.push(ROUTES.SIGN_IN);

        return null;
    }

    return (
        <div>

        </div>
    );
};

export default Home;