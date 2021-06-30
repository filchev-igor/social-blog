import React, {useContext} from "react";
import {useHistory} from "react-router-dom";
import {AuthUserContext, IsAuthUserLoadingContext} from "../contexts";
import * as ROUTES from "../constants/routes";

const Admin = () => {
    const authUser = useContext(AuthUserContext);
    const isAuthUserLoading = useContext(IsAuthUserLoadingContext);

    const history = useHistory();

    const condition = authUser => !!authUser;

    if (!condition(authUser)) {
        if (!isAuthUserLoading)
            history.push(ROUTES.SIGN_IN);

        return null;
    }
};

export default Admin;