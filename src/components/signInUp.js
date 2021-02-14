import {Link} from "react-router-dom";
import * as ROUTES from "../constants/routes";
import React from "react";
import {ContainerFluid, SingleColumn} from "./globalLayout";

export const SignInUpPage = props => (
    <ContainerFluid>
        <SingleColumn>
            <h5 className="card-title text-uppercase text-center">
                {props.doesUserHaveAccount ? "sign in" : "sign up"}
            </h5>

            {props.children}

            {props.firebaseError.code &&
            <div className="alert alert-danger mt-3" role="alert">{props.firebaseError.message}</div>}

            <ul className="list-group list-group-horizontal justify-content-between mt-2">
                <li className="list-group-item border-0 ps-0">
                    <Link className="btn btn-outline-info" to={props.doesUserHaveAccount ? ROUTES.SIGN_UP : ROUTES.SIGN_IN}>
                        {props.doesUserHaveAccount ? "Create account" : "Log in"}</Link>
                </li>

                <li className="list-group-item border-0 pe-0">{props.submitButton}</li>
            </ul>
        </SingleColumn>
    </ContainerFluid>
);