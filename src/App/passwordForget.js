import {ContainerFluid, LabeledInput, SingleColumn} from "../components/globalLayout";
import React, {useState} from "react";
import firebaseAuth from "../Firebase";
import {Link} from "react-router-dom";
import * as ROUTES from "../constants/routes";

const firebaseErrorState = {
    code: '',
    message: '',
    a: ''
};

const PasswordForget = () => {
    const [email, setEmail] = useState('');
    const [firebaseError, setFirebaseError] = useState(firebaseErrorState);
    const [isLinkSent, setIsLinkSent] = useState(false);

    const handlePasswordRestore = e => {
        firebaseAuth.sendPasswordResetEmail(email)
            .then(() => {
                setEmail('');
                setFirebaseError(firebaseErrorState);
                setIsLinkSent(true);
            })
            .catch(error => setFirebaseError(error));

        e.preventDefault();
    };

    return (
        <ContainerFluid>
            <SingleColumn>
                <h5 className="card-title text-uppercase text-center">
                    password restore
                </h5>

                <p className="card-text text-uppercase">type e-mail, which will receive link</p>

                <LabeledInput type="email" id="email" value={email} placeholder="Email" onChange={setEmail}/>

                {firebaseError.code &&
                <div className="alert alert-danger mt-3" role="alert">{firebaseError.message}</div>}

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
                        <button type="button" disabled={isLinkSent} className="btn btn-info" onClick={handlePasswordRestore}>Send</button>
                    </li>
                </ul>
            </SingleColumn>
        </ContainerFluid>
    );
}

export default PasswordForget;