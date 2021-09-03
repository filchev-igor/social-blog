import {useContext} from "react";
import {useHistory} from "react-router-dom";
import {IsInitializingContext} from "../contexts";
import * as ROUTES from "../constants/routes";
import {useSession} from "../hooks";

const Admin = () => {
    const isInitializing = useContext(IsInitializingContext);
    const user = useSession();

    const history = useHistory();

    const condition = authUser => !!authUser;

    if (isInitializing)
        return null;

    //TODO correct admin role
    if (!isInitializing && !condition(user)) {
        history.push(ROUTES.SIGN_IN);

        return null;
    }
};

export default Admin;