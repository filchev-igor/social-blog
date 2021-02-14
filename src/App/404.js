import React from "react";
import {ContainerFluid} from "../components/globalLayout";
import {PageDoesNotExistColumn} from "../components/404";
import {Link} from "react-router-dom";
import * as ROUTES from "../constants/routes";

const PageDoesNotExist = () => (
    <ContainerFluid>
        <PageDoesNotExistColumn>
            <h1 className="display-5 mb-3 text-uppercase text-danger">404 page</h1>

            <p>This page does not exist.</p>

            <Link className="btn btn-outline-danger text-uppercase" to={ROUTES.HOME}>home page</Link>
        </PageDoesNotExistColumn>
    </ContainerFluid>
);

export default PageDoesNotExist;