import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import common from "./reducers/common";
import auth from "./reducers/auth";
import sms from "./reducers/sms";

export default combineReducers({
  auth,
  common,
  sms,
  router: routerReducer
});
