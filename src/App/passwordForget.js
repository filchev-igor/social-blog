import {ContainerFluid, SingleColumn} from "../components/globalLayout";
import React, {useContext, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import * as ROUTES from "../constants/routes";
import { IsInitializingContext} from "../contexts";
import {firebaseAuthErrorData} from "../constants/firebase";
import Input from "../components/layout/input";
import {useSession} from "../hooks";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const PasswordForget = () => {
    const isInitializing = useContext(IsInitializingContext);
    const user = useSession();

    const history = useHistory();

    const [email, setEmail] = useState('');
    const [firebaseAuthError, setFirebaseAuthError] = useState(firebaseAuthErrorData);
    const [isLinkSent, setIsLinkSent] = useState(false);

    const condition = authUser => !!authUser;

    const handlePasswordRestore = e => {
        e.preventDefault();

        const auth = getAuth();

        sendPasswordResetEmail(auth, email)
            .then(() => {
                setEmail('');
                setFirebaseAuthError(firebaseAuthErrorData);
                setIsLinkSent(true);
            })
            .catch(error => setFirebaseAuthError(error));
    };

    if (isInitializing)
        return null;

    if (!isInitializing && condition(user)) {
        history.push(ROUTES.HOME);

        return null;
    }

    return (
        <ContainerFluid>
            <SingleColumn>
                <h5 className="card-title text-uppercase text-center">
                    password restore
                </h5>

                <p className="card-text text-uppercase">type e-mail, which will receive link</p>

                <Input type="email" id="email" value={email} placeholder="Email" onChange={setEmail}/>

                {firebaseAuthError.code &&
                <div className="alert alert-danger mt-3" role="alert">{firebaseAuthError.message}</div>}

                {isLinkSent &&
                <div className="alert alert-success mt-3" role="alert">
                    Check you e-mail and try to <Link to={ROUTES.SIGN_IN}>authorize</Link>
                </div>}

                <ul className="list-group list-group-horizontal justify-content-between mt-2">
                    <li className="list-group-item border-0 ps-0">
                        <Link className={isLinkSent ? "d-none" : "text-warning"} to={ROUTES.SIGN_IN}>
                            I remember the password
                        </Link>
                    </li>

                    <li className="list-group-item border-0 pe-0">
                        <button type="button" disabled={isLinkSent} className="btn btn-info"
                                onClick={handlePasswordRestore}>Send
                        </button>
                    </li>
                </ul>
            </SingleColumn>
        </ContainerFluid>
    );
}

export default PasswordForget;