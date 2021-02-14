import React, {useState} from "react";
import {SignInUpInput, SignInUpPage} from "../components/signInUp";
import firebaseAuth from "../Firebase";
import {useHistory} from "react-router-dom";
import * as ROUTES from "../constants/routes";

const firebaseErrorState = {
    code: '',
    message: '',
    a: ''
};

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [firstPassword, setFirstPassword] = useState('');
    const [secondPassword, setSecondPassword] = useState('');
    const [firebaseError, setFirebaseError] = useState(firebaseErrorState);

    const history = useHistory();

    const isInvalid =
        firstPassword !== secondPassword ||
        firstPassword === '' ||
        email === '';

    const handleCreateUser = e => {
        firebaseAuth.createUserWithEmailAndPassword(email, firstPassword)
            .then(authUser => {
                setEmail('');
                setFirstPassword('');
                setSecondPassword('');
                setFirebaseError(firebaseErrorState);
                history.push(ROUTES.HOME);
            })
            .catch(error => setFirebaseError(error));

        e.preventDefault();
    };

    return (
        <SignInUpPage
            doesUserHaveAccount={false}
            firebaseError={firebaseError}
            submitButton={
                <button disabled={isInvalid} type="button" className="btn btn-info" onClick={handleCreateUser}>Sign up</button>
            }>

            <SignInUpInput type="email" id="email" value={email} placeholder="E-mail" onChange={setEmail}/>

            <SignInUpInput type="password" id="firstPassword" value={firstPassword} placeholder="Password" onChange={setFirstPassword}/>

            <SignInUpInput type="password" id="secondPassword" value={secondPassword} placeholder="Repeat password" onChange={setSecondPassword}/>
        </SignInUpPage>
    );
};

export  default SignUp;