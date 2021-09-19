import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import {useReducer} from "react";

const initialState = [];

const init = () => initialState;

const reducer = (state, action) => {
    switch (action.type) {
        case 'add elements selector':
            state.splice(action.index, 0, {
                type: 'elements selector',
                value: '',
                id: generateUniqueID()
            });
            break;
        case 'add text':
            state.splice(action.index, 1, {
                type: 'text',
                value: '',
                id: generateUniqueID()
            });
            break;
        case 'update text':
            state.splice(action.index, 1, {
                type: 'text',
                value: action.value,
                id: state[action.index].id
            });
            break;
        case 'add link to image':
            state.splice(action.index, 1, {
                type: 'link to image',
                value: '',
                id: generateUniqueID()
            });
            break;
        case 'update link to image':
            state.splice(action.index, 1, {
                type: 'link to image',
                value: action.value,
                id: state[action.index].id
            });
            break;
        case 'add link to youtube':
            state.splice(action.index, 1, {
                type: 'link to youtube',
                value: '',
                id: generateUniqueID()
            });
            break;
        case 'update link to youtube':
            state.splice(action.index, 1, {
                type: 'link to youtube',
                value: action.value,
                id: state[action.index].id
            });
            break;
        case "delete element":
            const array = [...state];
            array.splice(action.index, 1);

            return array;
        case "change elements places":
            return [...action.array];
        case "reset layout":
            return init();
        case "set layout":
            return [...action.array];
        default:
            throw new Error();
    }

    return [...state];
};

const useDraftLayout = () => {
    const [state, dispatch] = useReducer(reducer, initialState, init);

    return {state, dispatch};
};

export default useDraftLayout;