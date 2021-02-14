import React, {useEffect, useState} from "react";
import {SignInUpPage} from "../components/signInUp";
import firebaseAuth from "../Firebase";
import {Link, useHistory} from "react-router-dom";
import * as ROUTES from "../constants/routes";
import {LabeledInput} from "../components/globalLayout";

const firebaseErrorState = {
    code: '',
    message: '',
    a: ''
};

const SignIn = props => {
    const {
        authUser
    } = props;

    const [hasTypedEmail, setHasTypedEmail] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firebaseError, setFirebaseError] = useState(firebaseErrorState);

    const history = useHistory();

    const handleLogin = e => {
        firebaseAuth.signInWithEmailAndPassword(email, password)
            .then(() => {
                setHasTypedEmail(false);
                setEmail('');
                setPassword('');
                setFirebaseError(firebaseErrorState);
                history.push(ROUTES.HOME);
            })
            .catch(error => setFirebaseError(error));

        e.preventDefault();
    };

    const handleEmail = () => setHasTypedEmail(true);

    useEffect(() => {
        if (firebaseError) {
            if (firebaseError.code === "auth/invalid-email" || firebaseError.code === "auth/user-not-found") {
                setHasTypedEmail(false);
                setEmail('');
                setPassword('');
            }
        }
    }, [firebaseError]);

    if (authUser === "halt execution")
        return null;

    return (
        <SignInUpPage
            doesUserHaveAccount={true}
            firebaseError={firebaseError}
            submitButton={
                <button type="button" className="btn btn-info"
                        onClick={!hasTypedEmail ? handleEmail : handleLogin}>{!hasTypedEmail ? "Continue" : "Sign in"}</button>
            }>
            {!hasTypedEmail ?
                <LabeledInput type="email" id="email" value={email} placeholder="E-mail" onChange={setEmail}/>
                :
                <LabeledInput type="password" id="password" value={password} placeholder="Password"
                               onChange={setPassword}/>
            }

            <p className="card-text mt-3 mb-0 text-center">
                <Link className="link-warning" to={ROUTES.PASSWORD_FORGET}>I forgot the password</Link>
            </p>
        </SignInUpPage>
    );
};

export default SignIn;