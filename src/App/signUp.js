import React, {useContext, useState} from "react";
import {SignInUpPage} from "../components/signInUp";
import {useHistory} from "react-router-dom";
import * as ROUTES from "../constants/routes";
import {AuthUserContext, IsAuthUserLoadingContext} from "../contexts";
import {firebaseAuth, firebaseFirestore} from "../Firebase";
import * as ROLES from "../constants/roles";
import {firebaseAuthErrorData, firebaseFirestoreErrorData} from "../constants/firebaseErrors";
import Input from "../components/layout/input";

const SignUp = () => {
    const authUser = useContext(AuthUserContext);
    const isAuthUserLoading = useContext(IsAuthUserLoadingContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [firebaseAuthError, setFirebaseAuthError] = useState(firebaseAuthErrorData);
    const [firebaseFirestoreError, setFirebaseFirestoreError] = useState(firebaseFirestoreErrorData);

    const history = useHistory();

    const condition = authUser => !!authUser;

    const isInvalid =
        password !== passwordRepeat ||
        password === '' ||
        email === '';

    const handleCreateUser = e => {
        e.preventDefault();

        firebaseAuth.createUserWithEmailAndPassword(email, password)
            .then(cred => {
                return firebaseFirestore.collection("users")
                    .doc(cred.user.uid)
                    .set({
                        role: ROLES.USER,
                        name: {
                            first: "",
                            last: ""
                        },
                        created: firebaseFirestore.Timestamp(new Date())
                    });
            })
            .then(() => {
                setEmail('');
                setPassword('');
                setPasswordRepeat('');
                setFirebaseAuthError(firebaseAuthErrorData);

                history.push(ROUTES.HOME);
            })
            .catch(error => setFirebaseAuthError(error));
    };

    if (condition(authUser)) {
        if (!isAuthUserLoading)
            history.push(ROUTES.HOME);

        return null;
    }

    return (
        <SignInUpPage
            doesUserHaveAccount={false}
            firebaseAuthError={firebaseAuthError}
            firebaseFirestoreError={firebaseFirestoreError}
            submitButton={
                <button disabled={isInvalid} type="button" className="btn btn-info" onClick={handleCreateUser}>Sign
                    up</button>
            }>

            <Input type="email" id="email" value={email} placeholder="E-mail" onChange={setEmail}/>

            <Input type="password" id="password" value={password} placeholder="Password" onChange={setPassword}/>

            <Input type="password" id="passwordRepeat" value={passwordRepeat} placeholder="Repeat password"
                          onChange={setPasswordRepeat}/>
        </SignInUpPage>
    );
};

export default SignUp;