import React, {useContext, useEffect, useLayoutEffect} from "react";
import {AuthUserContext, IsAuthUserLoadingContext} from "../contexts";
import * as ROUTES from '../constants/routes';
import {useHistory} from "react-router-dom";

const Home = () => {
    const authUser = useContext(AuthUserContext);
    const isAuthUserLoading = useContext(IsAuthUserLoadingContext);

    const history = useHistory();

    const condition = authUser => !!authUser;

    if (!condition(authUser)) {
        if (!isAuthUserLoading)
            history.push(ROUTES.SIGN_IN);

        return null;
    }

    return (
        <div>

        </div>
    );
};

export default Home;