import {
    HOME_PAGE_LOADED,
    VIEW_DETAIL_SMS_PAGE_UNLOADED,
    GET_DETAIL_SMS_BY_MSISDN,
    UPDATE_DETAIL_SMS_PAGE_UNLOADED,
    GET_REFERENCE_SMS_BY_MSISDN,
    UPDATE_FIELD_SMS,
    UPDATE_SMS_REFERENCE,
    UPDATE_SEARCH_SMS,
    UPDATE_SEARCH_SMS_PAGE,
    INSERT_DETAIL_SMS_PAGE_LOADED,
    INSERT_DETAIL_SMS_PAGE_UNLOADED,
    INSERT_DETAIL_SMS_UPDATE,
    INSERT_DETAIL_SMS,
    POP_UP_MODAL
} from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case HOME_PAGE_LOADED:
            return {
                ...state,
                listPenipu: action.payload[0],
                countPenipu: action.payload[1][0].jumlah,
                currentPage: 1,
                page: Math.ceil(action.payload[1][0].jumlah / 10),
                changeSearchCount: 10,
                changeSearchMsisdn: '',
                changeSearchJumlah: 0,
                changeStatus: 'Follow Up',
                changeSearchStatus: 'All',
                redirect: '',
                show: false
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
        case UPDATE_SEARCH_SMS_PAGE:
            switch (action.value) {
                case 'first':
                    return { ...state,
                        currentPage: 1
                    };
                case 'last':
                    return { ...state,
                        currentPage: state.page
                    };
                case 'next':
                    return { ...state,
                        currentPage: state.currentPage === state.page ? state.page : state.currentPage + 1
                    };
                case 'prev':
                    return { ...state,
                        currentPage: state.currentPage === 1 ? 1 : state.currentPage - 1
                    };
                default:
                    return { ...state,
                        currentPage: +action.value
                    };

            }
        case INSERT_DETAIL_SMS:
            return { ...state,
            };
        case INSERT_DETAIL_SMS_UPDATE:
            return { ...state,
                [action.key]: action.value,
                isFirst: false
            };
        case UPDATE_SEARCH_SMS:
        case UPDATE_FIELD_SMS:
            return { ...state,
                [action.key]: action.value,
                page: action.key === 'changeSearchCount' ? Math.ceil(state.countPenipu / action.value) : state.page
            };
        case UPDATE_SMS_REFERENCE:
            return { ...state,
                hasil: action.payload,
                selectedMSISDN: ''
            };
        case INSERT_DETAIL_SMS_PAGE_LOADED:
            return { ...state,
                pelapor: '',
                target: '',
                content: '',
                isFirst: true
            };
        case POP_UP_MODAL:
            return { ...state,
                show: action.value,
                result: action.arr,
                reload: !action.value,
                redirect: !action.value ? '/home' : null
            };
        case INSERT_DETAIL_SMS_PAGE_UNLOADED:
            return { ...state,
                reload: true
            };
        case VIEW_DETAIL_SMS_PAGE_UNLOADED:
        case UPDATE_DETAIL_SMS_PAGE_UNLOADED:
        default:
            return state;
    }
};