/* eslint-disable */
import {
  APP_LOAD,
  REDIRECT,
  LOGIN_PAGE_UNLOADED,
  REGISTER_PAGE_UNLOADED,
  FIRST_LOAD,
} from '../constants/actionTypes';

const defaultState = {
  appName: 'SMS Penipu',
  token: null,
  viewChangeCounter: 0,
  time: {
    days: 0,
    hours: 0,
    min: 0,
    sec: 0,
  },
  currentDate: new Date(),
  notif: []
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case APP_LOAD:
      return {
        ...state,
        token: action.token || null,
        appLoaded: true,
        currentUser: action.payload ? action.payload.username : null
      };
    case FIRST_LOAD:
      return {
        ...state
      };
    case REDIRECT:
      return { ...state,
        redirectTo: null
      };
      // case LOGOUT:
      //   return { ...state, redirectTo: '/', token: null, currentUser: null };
      // case LOGIN:
      //   return {
      //     ...state,
      //     redirectTo: action.error ? null : '/',
      //     token: action.error ? null : action.payload.access_token,
      //     currentUser: action.error ? null : action.payload.username
      //   };
      //  case REGISTER:
    case LOGIN_PAGE_UNLOADED:
    case REGISTER_PAGE_UNLOADED:
      return { ...state,
        viewChangeCounter: state.viewChangeCounter + 1
      };
    default:
      return state;
  }
};