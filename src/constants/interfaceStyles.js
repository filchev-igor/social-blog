export const UPPER_NAVBAR = "upper navbar";
export const LOWER_NAVBAR = "lower navbar";
export const HOME_PAGE = "home page";
export const POST_PAGE = "post page";
export const COMMENTS = "comments";
export const NEW_POST = "new post";
export const LIKE_BUTTONS = "like buttons";

export const DEFAULT_STYLES = {
    upperNavbar: {
        background: 'light',
        isLightColorScheme: true
    },
    lowerNavbar: {
        background: 'light',
        isLightColorScheme: true,
        logoutButtonColor: 'danger'
    },
    homePage: {
        background: 'white',
        cardColor: 'light',
        textColor: 'dark'
    },
    postPage: {
        background: 'white',
        cardColor: 'light',
        textColor: 'dark'
    },
    comments: {
        background: 'white',
        textColor: 'dark'
    },
    newPost: {
        background: 'white',
        textColor: 'dark'
    },
    likeButtons : {
        like: {
            background: "success",
            icon: "hand-thumbs"
        },
        dislike: {
            background: "danger",
            icon: "hand-thumbs"
        }
    }
};

const interfaceStyles = [
    UPPER_NAVBAR,
    LOWER_NAVBAR,
    HOME_PAGE,
    POST_PAGE,
    COMMENTS,
    NEW_POST,
    LIKE_BUTTONS
];

export default interfaceStyles;