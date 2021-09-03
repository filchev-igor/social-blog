import React, {useContext} from "react";
import * as ROUTES from '../constants/routes';
import {useHistory} from "react-router-dom";
import {useSession} from "../hooks";
import {IsInitializingContext} from "../contexts";

const Home = () => {
    const isInitializing = useContext(IsInitializingContext);
    const user = useSession();

    const history = useHistory();

    const condition = authUser => !!authUser;

    if (isInitializing)
        return null;

    if (!isInitializing && !condition(user)) {
        history.push(ROUTES.SIGN_IN);

        return null;
    }

    return (
        <div>

        </div>
    );
};

export default Home;