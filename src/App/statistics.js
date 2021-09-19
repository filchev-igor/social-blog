import React, {useContext} from "react";
import {useHistory} from "react-router-dom";
import {IsInitializingContext} from "../contexts";
import * as ROUTES from "../constants/routes";
import {useFullUserData, useSession} from "../hooks";
import * as ROLES from "../constants/roles";
import {ContainerFluid} from "../components/globalLayout";
import StatisticsList from "../components/statistics/statisticsList";

const Statistics = () => {
    const isInitializing = useContext(IsInitializingContext);
    const user = useSession();

    const {isLoadingUserCollection, userCollection} = useFullUserData();

    const history = useHistory();

    const condition = authUser => !!authUser;

    if (isInitializing)
        return null;

    if (!isInitializing && !condition(user)) {
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
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">First name</th>
                                <th scope="col">Last name</th>
                                <th scope="col">Number of published posts</th>
                                <th scope="col">Has draft</th>
                            </tr>
                        </thead>

                        <StatisticsList/>
                    </table>
                </div>
            </div>
        </ContainerFluid>
    );
};

export default Statistics;