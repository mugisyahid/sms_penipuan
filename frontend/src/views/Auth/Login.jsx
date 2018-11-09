/* eslint-disable */
import React, { Component } from "react";
import { connect } from 'react-redux';
import agent from '../../agent';
import {
    UPDATE_FIELD_AUTH,
    LOGIN,
    LOGIN_PAGE_UNLOADED
} from '../../constants/actionTypes';
import { Redirect } from 'react-router-dom';

import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

const mapStateToProps = state => ({ ...state });
const mapDispatchToProps = dispatch => ({
    onChangeUsername: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'username', value }),
    onChangePassword: value =>
        dispatch({ type: UPDATE_FIELD_AUTH, key: 'password', value }),
    onSubmit: (email, password) => {
        const payload = agent.Auth.login(email, password)
        dispatch({ type: LOGIN, payload })
    },
    onUnload: () =>
        dispatch({ type: LOGIN_PAGE_UNLOADED })
});

class Login extends Component {
    constructor() {
        super();
        this.changeUsername = ev => this.props.onChangeUsername(ev.target.value);
        this.changePassword = ev => this.props.onChangePassword(ev.target.value);
        this.submitForm = (username, password) => ev => {
            ev.preventDefault();
            this.props.onSubmit(username, password);
        };
    }

    componentWillMount() {

    }
    componentWillUnmount() {
        this.props.onUnload();
    }
    render() {
        if (window.localStorage.getItem('user') && window.localStorage.getItem('user') !== 'undefined') {
            return <Redirect to='/home' />;
        }
        const username = this.props.auth.username;
        const password = this.props.auth.password;
        return (
            <div className="auth-page">
                <div className="container page">
                    <div className="row">
                        <div className="col-md-6 offset-md-3 col-xs-12">
                            <h1 className="text-xs-center">Login SMS Penipu</h1>
                            <p className="text-xs-center">
                            </p>
                            <p>{this.props.auth.errors ? <font face="verdana" color="red">{this.props.auth.errors}</font> : ""}</p>
                            <form onSubmit={this.submitForm(username, password)}>
                                <fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="text"
                                            placeholder="username"
                                            value={this.props.auth.username}
                                            onChange={this.changeUsername} />
                                    </fieldset>
                                    <fieldset className="form-group">
                                        <input
                                            className="form-control form-control-lg"
                                            type="password"
                                            placeholder="Password"
                                            value={this.props.auth.password}
                                            onChange={this.changePassword} />
                                    </fieldset>

                                    <button
                                        className="btn btn-lg btn-primary pull-xs-right"
                                        type="submit"
                                        disabled={this.props.inProgress}>
                                        Login
                                    </button>
                                </fieldset>
                            </form>
                        </div>

                    </div>
                </div>
            </div>);
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login);
