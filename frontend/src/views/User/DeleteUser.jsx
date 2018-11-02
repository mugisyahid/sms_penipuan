/* eslint-disable */
import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { connect } from 'react-redux';
import agent from '../../agent';
import moment from 'moment';
import { Link, Redirect } from 'react-router-dom';

import Card from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

import {
    DELETE_USER_PAGE_UNLOADED,
    GET_USER_BY_ID,
    DELETE_USER_BY_ID
} from '../../constants/actionTypes';

const mapStateToProps = state => ({ ...state, user: state.user.user, redirect: state.user.redirect });
const mapDispatchToProps = dispatch => ({
    onLoad: (payload) =>
        dispatch({ type: GET_USER_BY_ID, payload }),
    onUnload: () =>
        dispatch({ type: DELETE_USER_PAGE_UNLOADED }),
    onClickDelete: payload =>
        dispatch({ type: DELETE_USER_BY_ID, payload })
});

class DeleteUser extends Component {
    componentWillMount() {
        this.props.onLoad(Promise.all([agent.User.getUserById(this.props.location.pathname.replace('/deleteUser/', ''))]))
    }
    componentWillUnmount() {
        this.props.onUnload();
    }
    render() {
        const user = JSON.parse(window.localStorage.getItem('user'))
        if (!user) {
            return <Redirect to='/login' />;
        } else if (!user.PRIVILEGES_ROLES.includes('Admin')) {
            return <Redirect to='/home' />;
        }
        const del = () => {
            confirmAlert({
                title: `Delete User ${this.props.user[0][0].USER_ID}`,
                message: 'Are you sure to do this?',
                buttons: [
                    {
                        label: 'Yes',
                        onClick: () => this.props.onClickDelete(agent.User.deleteUserById(this.props.location.pathname.replace('/deleteUser/', '')))
                    },
                    {
                        label: 'No',
                        onClick: () => { }
                    }
                ]
            })


        };
        if (!this.props.user) {
            return null;
        }
        if (this.props.redirect) {
            return <Redirect to={this.props.redirect} />;
        }

        return (<div className="content">
            <Grid fluid>
                <Row>
                    <Col md={12}>
                        <Card
                            title={`User ${this.props.user[0][0].USER_ID}`}
                            category={`Created at ${moment(this.props.user[0][0].DATE_CREATED).format('hh:mm, DD MMM YYYY')}`}
                            content={
                                <div>
                                    <div className="typo-line">
                                        <p>
                                            <span className="category">Name</span>{`${this.props.user[0][0].NAME}`}
                                        </p>
                                    </div>
                                    <div className="typo-line">
                                        <p>
                                            <span className="category">Email</span>{`${this.props.user[0][0].CONTACT_EMAIL}`}
                                        </p>
                                    </div>
                                    <div className="typo-line">
                                        <p>
                                            <span className="category">Username</span>{`${this.props.user[0][0].USERNAME}`}
                                        </p>
                                    </div>
                                    <div className="typo-line">
                                        <p>
                                            <span className="category">Departments</span>{`${this.props.user[0][0].DEPARTMENT}`}
                                        </p>
                                    </div>
                                    <div className="typo-line">
                                        <p>
                                            <span className="category">Division</span>{`${this.props.user[0][0].DIVISION}`}
                                        </p>
                                    </div>
                                    <div className="typo-line">
                                        <p>
                                            <span className="category">Roles</span>{`${this.props.user[0][0].PRIVILEGES_ROLES}`}
                                        </p>
                                    </div>
                                    <div className="typo-line">
                                        <p>
                                            <span className="category">Status</span>{`${this.props.user[0][0].STATUS}`}
                                        </p>
                                    </div>
                                    <div className="typo-line">
                                        <Button bsStyle="danger" fill onClick={del}>
                                            Delete
                                    </Button>
                                    </div>
                                </div>
                            }
                        />
                    </Col>
                </Row>
                <Row> <div className="col-md-12">
                    <Link to="/user">
                        <Button bsStyle="info" fill type="submit">
                            Back
                        </Button>
                    </Link>
                </div>
                </Row>
            </Grid>

        </div>);
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(DeleteUser);
