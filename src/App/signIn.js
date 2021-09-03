import React, {useContext, useEffect, useState} from "react";
import {SignInUpPage} from "../components/signInUp";
import {Link, useHistory} from "react-router-dom";
import * as ROUTES from "../constants/routes";
import {IsInitializingContext} from "../contexts";
import {firebaseAuthErrorData} from "../constants/firebaseErrors";
import Input from "../components/layout/input";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {useSession} from "../hooks";

const SignIn = () => {
    const isInitializing = useContext(IsInitializingContext);
    const user = useSession();

    const [hasTypedEmail, setHasTypedEmail] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firebaseAuthError, setFirebaseAuthError] = useState(firebaseAuthErrorData);

    const history = useHistory();

    const condition = authUser => !!authUser;

    const handleLogin = e => {
        const auth = getAuth();

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                setHasTypedEmail(false);
                setEmail('');
                setPassword('');
                setFirebaseAuthError(firebaseAuthErrorData);
                history.push(ROUTES.HOME);
            })
            .catch(error => setFirebaseAuthError(error));

        e.preventDefault();
    };

    const handleEmail = () => setHasTypedEmail(true);

    useEffect(() => {
        if (firebaseAuthError) {
            if (firebaseAuthError.code === "auth/invalid-email" || firebaseAuthError.code === "auth/user-not-found") {
                setHasTypedEmail(false);
                setEmail('');
                setPassword('');
            }
        }
    }, [firebaseAuthError]);

    if (isInitializing)
        return null;

    if (!isInitializing && condition(user)) {
        history.push(ROUTES.HOME);

        return null;
    }

    return (
        <SignInUpPage
            doesUserHaveAccount={true}
            firebaseAuthError={firebaseAuthError}
            submitButton={
                <button type="button" className="btn btn-info"
                        onClick={!hasTypedEmail ? handleEmail : handleLogin}>{!hasTypedEmail ? "Continue" : "Sign in"}</button>
            }>
            {!hasTypedEmail ?
                <Input type="email" id="email" value={email} placeholder="E-mail" onChange={setEmail}/>
                :
                <Input type="password" id="password" value={password} placeholder="Password"
                              onChange={setPassword}/>
            }

            <p className="card-text mt-3 mb-0 text-center">
                <Link className="link-warning" to={ROUTES.PASSWORD_FORGET}>I forgot the password</Link>
            </p>
        </SignInUpPage>
    );
};

export default SignIn;