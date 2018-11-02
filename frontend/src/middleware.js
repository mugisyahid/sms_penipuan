import agent from './agent';
import {
  ASYNC_START,
  ASYNC_END,
  LOGIN,
  LOGOUT,
  UPDATE_TIME
} from './constants/actionTypes';

const promiseMiddleware = store => next => action => {
  if (isPromise(action.payload)) {
    store.dispatch({ type: ASYNC_START, subtype: action.type });

    const currentView = store.getState().viewChangeCounter;
    const skipTracking = action.skipTracking;

    action.payload.then(
      res => {
        const currentState = store.getState()
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return
        }
        action.payload = res;
        store.dispatch({ type: ASYNC_END, promise: action.payload });
        store.dispatch(action);
      },
      error => {
        const currentState = store.getState()
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return
        }
        console.log('ERROR', error);
        action.error = true;
        action.payload = error.response.body;
        if (!action.skipTracking) {
          store.dispatch({ type: ASYNC_END, promise: action.payload });
        }
        store.dispatch(action);
      }
    );

    return;
  }

  next(action);
};

const localStorageMiddleware = store => next => action => {
  // set localstorage
  if (process.env.NODE_ENV !== 'production' && action.type !== UPDATE_TIME) {
    // console.log(store.getState())
  }
  if ((/*action.type === REGISTER ||*/ action.type === LOGIN) && action.payload) {
    if (!action.error) {
      window.localStorage.setItem('jwt', action.payload.token);
      window.localStorage.setItem('user', JSON.stringify(action.payload.user));
      window.localStorage.setItem('expiredDate', JSON.stringify(action.payload.expiredDate));
      agent.setToken(action.payload.token);
    }
  } else if (action.type === LOGOUT) {
    window.localStorage.clear()
    agent.setToken(null);
  }

  next(action);
};

function isPromise(v) {
  return v && typeof v.then === 'function';
}


export { promiseMiddleware, localStorageMiddleware }
