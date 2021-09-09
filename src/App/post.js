import React, {useContext} from "react";
import {IsInitializingContext} from "../contexts";
import {useSession} from "../hooks";
import {useHistory, Switch, Route, useRouteMatch} from "react-router-dom";
import * as ROUTES from "../constants/routes";
import PostContent from "../components/post/postContent";
import PageDoesNotExist from "./404";

const Post = () => {
    const isInitializing = useContext(IsInitializingContext);
    const user = useSession();

    const history = useHistory();
    const {path} = useRouteMatch();

    const condition = authUser => !!authUser;

    if (isInitializing)
        return null;

    if (!isInitializing && !condition(user)) {
        history.push(ROUTES.SIGN_IN);

        return null;
    }

    return (
        <Switch>
            <Route exact path={path}>
                <PageDoesNotExist/>
            </Route>
            <Route path={`${path}/:postId`}>
                <PostContent/>
            </Route>
        </Switch>
    );
};

export default Post;