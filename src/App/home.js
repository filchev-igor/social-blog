import React, {useContext, useEffect, useState} from "react";
import * as ROUTES from '../constants/routes';
import {useHistory} from "react-router-dom";
import {useFullUserData, usePostsCollection, useSession} from "../hooks";
import {IsInitializingContext} from "../contexts";
import {ContainerFluid} from "../components/globalLayout";
import Cards from "../components/home/Cards";
import PlaceholderCard from "../components/layout/placeholderCard";
import * as interfaceStyles from "../constants/interfaceStyles";

const Home = () => {
    const isInitializing = useContext(IsInitializingContext);
    const user = useSession();

    const publishedPosts = usePostsCollection();

    const {isLoadingUserCollection, userCollection} = useFullUserData();

    const [background, setBackground] = useState('white');

    const history = useHistory();

    const condition = authUser => !!authUser;

    useEffect(() => {
        if (!isLoadingUserCollection) {
            const component = interfaceStyles.HOME_PAGE
                .split(" ")
                .map((value, index) => {
                    if (index)
                        return value[0].toUpperCase() + value.slice(1);

                    return value;
                })
                .join("");

            const elementStyles = userCollection['interfaceStyles'][component];

            const backgroundColor = elementStyles['background'];

            setBackground(backgroundColor);
        }
    }, [isLoadingUserCollection, userCollection]);

    if (isInitializing)
        return null;

    if (!isInitializing && !condition(user)) {
        history.push(ROUTES.SIGN_IN);

        return null;
    }

    if (!publishedPosts.length) {
        const maxPlaceholders = 6;
        const placeholdersArray = [];

        for (let i = 0; i < maxPlaceholders; i++) {
            placeholdersArray.push(<PlaceholderCard key={`placeholder-card-${i}`}/>)
        }

        return (
            <ContainerFluid>
                <div className="row justify-content-center">
                    <div className="col col-sm-9 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                        {placeholdersArray}
                    </div>
                </div>
            </ContainerFluid>
        );
    }

    return (
        <div className={`container-fluid py-5 min-vh-100 bg-${background}`}>
            <div className="row justify-content-center">
                <div className="col col-sm-9 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                    <Cards publishedPosts={publishedPosts}/>
                </div>
            </div>
        </div>
    );
};

export default Home;