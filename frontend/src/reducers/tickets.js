import {
    TICKET_PAGE_UNLOADED,
    VIEW_TICKET_PAGE_UNLOADED,
    GET_TICKET,
    GET_TICKET_BY_ID,
    DELETE_TICKET_BY_ID,
    INSERT_TICKET,
    UPDATE_FIELD_TICKET,
    UPDATE_DOCUMENT_TICKET,
    REMOVE_ALL_UPLOADED_DOCUMENTS,
    REMOVE_SINGLE_DOCS,
    GET_TICKET_BY_USER,
    INSERT_TICKET_PAGE_UNLOADED,
    INSERT_TICKET_LOADED,
    REJECT_TICKET,
    APPROVE_TICKET,
    EXECUTOR_APPROVE_TICKET,
    EXECUTOR_REJECT_TICKET,
    EXECUTOR_FINISH_TICKET,
    REVIEW_TICKET_LOADED,
    UPDATE_TICKET_LOADED,
    UPDATE_TICKET_PAGE_UNLOADED,
    UPDATE_TICKET,
    UPDATE_DOCUMENT_EXECUTOR_TICKET,
    REMOVE_SINGLE_DOCS_EXECUTOR,
    DONE_TICKET,
    HOME_PAGE_LOADED,
    HOME_PAGE_UNLOADED,
    EXECUTOR_PAGE_LOADED,
    UPDATE_SEARCH_TICKET,
    EXCEED_UPLOAD_QUOTA
} from '../constants/actionTypes';

const initialUserState = {
    files: [],
    newFiles: [],
    stats: []
}

export default (state = initialUserState, action) => {
    switch (action.type) {
        case HOME_PAGE_LOADED:
            return {
                ...state,
                stats: action.payload
            };
        case GET_TICKET_BY_USER:
        case GET_TICKET:
            return {
                ...state,
                tickets: action.payload
            };
        case GET_TICKET_BY_ID:
            return {
                ...state,
                ticket: action.payload[0],
                documents: action.payload[0][1],
                newFiles: []
            };
        case UPDATE_TICKET_LOADED:
            return {
                ...state,
                oldTicket: action.payload[0][0],
                files: action.payload[0][1],
                reportType: action.payload[1],
                reportConsumer: action.payload[2]
            };
        case REVIEW_TICKET_LOADED:
            return {
                ...state,
                ticket: action.payload[0],
                executors: action.payload[1],
                documents: action.payload[0][1]
            };
        case UPDATE_DOCUMENT_EXECUTOR_TICKET:
        case UPDATE_DOCUMENT_TICKET:
            return {
                ...state,
                files: state.files.concat(action.files)
            };
        case EXCEED_UPLOAD_QUOTA:
            return {
                ...state,
                uploadWarning: action.payload
            };
        case REMOVE_ALL_UPLOADED_DOCUMENTS:
            return {
                ...state,
                files: []
            };
        case UPDATE_FIELD_TICKET:
            return { ...state, [action.key]: action.value };
        case UPDATE_SEARCH_TICKET:
            return { ...state, [action.key]: action.value };
        case REJECT_TICKET:
        case APPROVE_TICKET:
        case DONE_TICKET:
        case EXECUTOR_REJECT_TICKET:
        case EXECUTOR_APPROVE_TICKET:
        case EXECUTOR_FINISH_TICKET:
        case DELETE_TICKET_BY_ID:
        case INSERT_TICKET:
        case UPDATE_TICKET:
            return { ...state, redirect: '/ticket' };
        case INSERT_TICKET_LOADED:
            return {
                ...state,
                reportType: action.payload[0],
                reportConsumer: action.payload[1],
                files: []
            };
        case REMOVE_SINGLE_DOCS_EXECUTOR:
        case REMOVE_SINGLE_DOCS:
            return {
                ...state,
                files: action.payload
            };
        case EXECUTOR_PAGE_LOADED:
            return {
                ...state,
                ticket: action.payload[0],
                files: action.payload[0][1],
            };
        case VIEW_TICKET_PAGE_UNLOADED:
        case INSERT_TICKET_PAGE_UNLOADED:
        case TICKET_PAGE_UNLOADED:
        case UPDATE_TICKET_PAGE_UNLOADED:
        case HOME_PAGE_UNLOADED:
            return {};
        default:
            return state;
    }
};
