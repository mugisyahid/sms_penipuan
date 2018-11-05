import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import React from 'react';
import { store, history } from './store';

import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import indexRoutes from "./routes/index";

import Login from "./views/Auth/Login"

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard.css?v=1.2.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";

ReactDOM.render((
    <Provider store={store}>
        {<ConnectedRouter history={history}>
            <Switch>
                <Route path="/login" component={Login}/>
                {/* <Route path="/login" component={Logout} /> */}
                {indexRoutes.map((prop, key) => {
                    return <Route to={prop.path} component={prop.component} key={key} />;
                })}
            </Switch>
        </ConnectedRouter>}
    </Provider>
), document.getElementById('root'));
