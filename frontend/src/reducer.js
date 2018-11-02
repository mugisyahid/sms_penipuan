import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import common from "./reducers/common";
import auth from "./reducers/auth";
import ticket from "./reducers/tickets";
import user from "./reducers/users";

export default combineReducers({
  auth,
  common,
  ticket,
  user,
  router: routerReducer
});
