import {
    HOME_PAGE_LOADED
} from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case HOME_PAGE_LOADED:
            return {
                ...state,
                listPenipu: action.payload[0],
                page: 1,
                limit: 10
            }
        default:
            return state;
    }
};