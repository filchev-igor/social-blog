import React, {useContext, useState} from "react";
import {SignInUpPage} from "../components/signInUp";
import firebaseAuth from "../Firebase";
import {useHistory} from "react-router-dom";
import * as ROUTES from "../constants/routes";
import {LabeledInput} from "../components/globalLayout";
import firebaseErrorData from "../constants/firebaseError";
import {AuthUserContext} from "../contexts";

const SignUp = () => {
    const authUser = useContext(AuthUserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [firebaseError, setFirebaseError] = useState(firebaseErrorData);

    const history = useHistory();

    const condition = authUser => !!authUser;

    const isInvalid =
        password !== passwordRepeat ||
        password === '' ||
        email === '';

    const handleCreateUser = e => {
        firebaseAuth.createUserWithEmailAndPassword(email, password)
            .then(() => {
                setEmail('');
                setPassword('');
                setPasswordRepeat('');
                setFirebaseError(firebaseErrorData);
                history.push(ROUTES.ACCOUNT);
            })
            .catch(error => setFirebaseError(error));

        e.preventDefault();
    };

    if (condition(authUser)) {
        history.push(ROUTES.HOME);

        return null;
    }

    return (
        <SignInUpPage
            doesUserHaveAccount={false}
            firebaseError={firebaseError}
            submitButton={
                <button disabled={isInvalid} type="button" className="btn btn-info" onClick={handleCreateUser}>Sign up</button>
            }>

            <LabeledInput type="email" id="email" value={email} placeholder="E-mail" onChange={setEmail}/>

            <LabeledInput type="password" id="password" value={password} placeholder="Password" onChange={setPassword}/>

            <LabeledInput type="password" id="passwordRepeat" value={passwordRepeat} placeholder="Repeat password" onChange={setPasswordRepeat}/>
        </SignInUpPage>
    );
};

export  default SignUp;