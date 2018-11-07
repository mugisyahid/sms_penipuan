import {
    HOME_PAGE_LOADED,
    VIEW_DETAIL_SMS_PAGE_UNLOADED,
    GET_DETAIL_SMS_BY_MSISDN,
    UPDATE_DETAIL_SMS_PAGE_UNLOADED,
    GET_REFERENCE_SMS_BY_MSISDN,
    UPDATE_FIELD_SMS,
    UPDATE_SMS_REFERENCE
} from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case HOME_PAGE_LOADED:
            return {
                ...state,
                listPenipu: action.payload[0],
                page: 1,
                limit: 100
            }
        case GET_DETAIL_SMS_BY_MSISDN:
            return {
                ...state,
                detail: action.payload[0]
            }
        case GET_REFERENCE_SMS_BY_MSISDN:
            return {
                ...state,
                reference: action.payload[0]
            }
        case UPDATE_FIELD_SMS:
            return { ...state,
                [action.key]: action.value
            };
        case UPDATE_SMS_REFERENCE:
            return { ...state,
                hasil: action.payload
            };
        case VIEW_DETAIL_SMS_PAGE_UNLOADED:
        case UPDATE_DETAIL_SMS_PAGE_UNLOADED:
        default:
            return state;
    }
};