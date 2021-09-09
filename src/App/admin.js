import React, {useContext, useState} from "react";
import {useHistory} from "react-router-dom";
import {IsInitializingContext} from "../contexts";
import * as ROUTES from "../constants/routes";
import {useSession, useUserCollection} from "../hooks";
import * as ROLES from "../constants/roles";
import {ContainerFluid} from "../components/globalLayout";
import TableBody from "../components/admin/tableBody";
import {firebaseAuthErrorData} from "../constants/firebaseErrors";

const Admin = () => {
    const [firebaseAuthError, setFirebaseAuthError] = useState(firebaseAuthErrorData);

    const isInitializing = useContext(IsInitializingContext);
    const user = useSession();

    const {isLoadingUserCollection, userCollection} = useUserCollection(isInitializing ? "" :
        user ? user.uid : "");

    const history = useHistory();

    const condition = authUser => !!authUser;

    if (isInitializing)
        return null;

    if (!isInitializing && !condition(user)) {
        console.log(23);

        history.push(ROUTES.SIGN_IN);

        return null;
    }

    if (isLoadingUserCollection)
        return null;

    if (!isLoadingUserCollection && userCollection.role !== ROLES.ADMIN) {
        history.push(ROUTES.HOME);

        return null;
    }

    return (
        <ContainerFluid>
            <div className="row justify-content-center">
                <div className="col col-sm-9 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                    {firebaseAuthError.code &&
                    <div className="alert alert-danger mt-3" role="alert">{firebaseAuthError.message}</div>}

                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Username</th>
                                <th scope="col">First name</th>
                                <th scope="col">Last name</th>
                                <th scope="col">Number of published posts</th>
                                <th scope="col">Has draft</th>
                                <th scope="col">

                                </th>
                            </tr>
                        </thead>

                        <TableBody email={user.email} setFirebaseAuthError={setFirebaseAuthError}/>
                    </table>
                </div>
            </div>
        </ContainerFluid>
    );
};

export default Admin;