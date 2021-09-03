import React, {useContext} from "react";
import {ContainerFluid} from "../components/globalLayout";
import {Link, Redirect, Route, Switch, useHistory, useRouteMatch} from "react-router-dom";
import * as ROUTES from '../constants/routes';
import AccountPage from "../components/accountPage/accountPage";
import {IsInitializingContext} from "../contexts";
import {useSession} from "../hooks";

const accountLinks = [
    ROUTES.ACCOUNT_USER_DATA,
    ROUTES.ACCOUNT_SETTINGS,
    ROUTES.ACCOUNT_INTERFACE_SETTINGS
];

const accountLinksName = accountLinks.map(value => value.slice(1));

const Account = () => {
    const isInitializing = useContext(IsInitializingContext);
    const user = useSession();

    const history = useHistory();
    const {path, url} = useRouteMatch();

    const condition = authUser => !!authUser;

    if (isInitializing)
        return null;

    if (!isInitializing && !condition(user)) {
        history.push(ROUTES.SIGN_IN);

        return null;
    }

    
    return (
        <ContainerFluid>
            <div className="row">
                <div className="col">
                    <ul className="nav flex-column">
                        {accountLinksName.map((value, index) => {
                            const linkText = value[0].toUpperCase() + value.slice(1).split('-').join(' ');

                            return <li className="nav-item" key={index}>
                                <Link className="nav-link" to={`${url}/${value}`}>{linkText}</Link>
                            </li>;
                        })}
                    </ul>
                </div>

                <div className="col-11">
                    <Switch>
                        <Route exact path={path}>
                            <Redirect to={`${path}/${accountLinksName[0]}`}/>
                        </Route>
                        <Route path={`${path}/:pageId`}>
                            <AccountPage/>
                        </Route>
                    </Switch>
                </div>
            </div>
        </ContainerFluid>
    );
};

export default Account;