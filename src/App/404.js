import React, {useContext} from "react";
import {ContainerFluid} from "../components/globalLayout";
import {Link} from "react-router-dom";
import * as ROUTES from "../constants/routes";
import {AuthUserContext} from "../contexts";

const PageDoesNotExist = () => {
    const authUser = useContext(AuthUserContext);

    const condition = authUser => !!authUser;

    return <ContainerFluid>
        <div className="row justify-content-center">
            <div className="col col-sm-9 col-md-8 col-lg-8 col-xl-8 col-xxl-8 text-center">
                <h1 className="display-5 mb-3 text-uppercase text-danger">404 page</h1>

                <p>This page does not exist.</p>

                <Link className="btn btn-outline-danger text-uppercase"
                      to={condition(authUser) ? ROUTES.HOME : ROUTES.SIGN_IN}>home page</Link>
            </div>
        </div>
    </ContainerFluid>;
};

export default PageDoesNotExist;