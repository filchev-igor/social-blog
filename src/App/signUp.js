import React, {useContext, useState} from "react";
import {SignInUpPage} from "../components/signInUp";
import {useHistory} from "react-router-dom";
import * as ROUTES from "../constants/routes";
import {IsInitializingContext} from "../contexts";
import * as ROLES from "../constants/roles";
import {firebaseAuthErrorData, firebaseFirestoreErrorData} from "../constants/firebase";
import Input from "../components/layout/input";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {doc, setDoc} from "firebase/firestore";
import {firebaseDb} from "../Firebase";
import {useSession} from "../hooks";
import {DEFAULT_STYLES} from "../constants/interfaceStyles";

const SignUp = () => {
    const isInitializing = useContext(IsInitializingContext);
    const user = useSession();

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

        const auth = getAuth();

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                try {
                    await setDoc(doc(firebaseDb, "users", userCredential.user.uid), {
                        role: ROLES.USER,
                        name: {
                            first: "",
                            last: ""
                        },
                        creationTime: new Date(),
                        publishedPosts: 0,
                        hasDraft: false,
                        interfaceStyles: DEFAULT_STYLES
                    });
                }
                catch(error) {
                    setFirebaseFirestoreError(error)
                }
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

    if (isInitializing)
        return null;

    if (!isInitializing && condition(user)) {
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