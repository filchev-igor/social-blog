import React, {useContext} from "react";
import * as ROUTES from '../constants/routes';
import {useHistory} from "react-router-dom";
import {usePostsCollection, useSession} from "../hooks";
import {IsInitializingContext} from "../contexts";
import {ContainerFluid} from "../components/globalLayout";
import Cards from "../components/home/Cards";

const Home = () => {
    const isInitializing = useContext(IsInitializingContext);
    const user = useSession();

    const publishedPosts = usePostsCollection();

    const history = useHistory();

    const condition = authUser => !!authUser;

    if (isInitializing)
        return null;

    if (!isInitializing && !condition(user)) {
        history.push(ROUTES.SIGN_IN);

        return null;
    }

    return (
        <ContainerFluid>
            <div className="row justify-content-center">
                <div className="col col-sm-9 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                    <Cards publishedPosts={publishedPosts}/>
                </div>
            </div>
        </ContainerFluid>
    );
};

export default Home;