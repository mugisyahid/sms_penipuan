import {
    USER_PAGE_UNLOADED,
    VIEW_USER_PAGE_UNLOADED,
    GET_USER,
    GET_USER_BY_ID,
    UPDATE_USER_BY_ID,
    DELETE_USER_BY_ID,
    INSERT_USER,
    UPDATE_FIELD_USER,
    UPDATE_USER_PAGE_LOADED
} from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case GET_USER:
            return {
                ...state,
                users: action.payload
            };
        case UPDATE_USER_PAGE_LOADED:
            return {
                ...state,
                oldUser: action.payload
            };
        case UPDATE_USER_BY_ID:
            return {
                ...state,
                user: action.payload,
                redirect: '/user'
            };
        case GET_USER_BY_ID:
            return {
                ...state,
                user: action.payload
            };
        case UPDATE_FIELD_USER:
            return { ...state, [action.key]: action.value };
        case DELETE_USER_BY_ID:
        case INSERT_USER:
            return { ...state, redirect: '/user' };
        case VIEW_USER_PAGE_UNLOADED:
        case USER_PAGE_UNLOADED:
            return {};
        default:
            return state;
    }
};
