/* eslint-disable */
import React, { Component } from "react";
import {
    Grid,
    Row,
    Col,
    FormGroup,
    ControlLabel,
    FormControl,
} from "react-bootstrap";
import { connect } from 'react-redux';
import agent from '../../agent';
import moment from 'moment';
import { Link, Redirect } from 'react-router-dom';

import Card from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";

import {
    UPDATE_USER_BY_ID,
    UPDATE_FIELD_USER,
    INSERT_USER_PAGE_UNLOADED,
    INSERT_USER
} from '../../constants/actionTypes';

String.prototype.replaceAll = function (searchStr, replaceStr) {
    var str = this;
    // escape regexp special characters in search string
    searchStr = searchStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    return str.replace(new RegExp(searchStr, 'gi'), replaceStr);
};

const mapStateToProps = state => ({ ...state, redirect: state.user.redirect, oldUser: state.user.oldUser });
const mapDispatchToProps = dispatch => ({
    onSubmit: (status, createdDate, username, email, name, password, roles, department, division) => {
        const payload = agent.User.insertUser(status, moment(createdDate).format('YYYY-MM-DD HH:mm:ss'), username, email, name, password, roles, department, division);
        dispatch({ type: INSERT_USER, payload })
    },
    onUnload: () =>
        dispatch({ type: INSERT_USER_PAGE_UNLOADED }),
    onUpdateField: (key, value) =>
        dispatch({ type: UPDATE_FIELD_USER, key, value })
});

class NewUser extends Component {
    constructor() {
        super()
        const updateFieldEvent = key => ev => this.props.onUpdateField(key, ev.target.value);
        this.changeUsername = updateFieldEvent('username');
        this.changeEmail = updateFieldEvent('email');
        this.changeName = updateFieldEvent('name');
        this.changePassword = updateFieldEvent('password');
        this.changeRoles = updateFieldEvent('roles');
        this.changeStatus = updateFieldEvent('status');
        this.changeDivision = updateFieldEvent('division');
        this.changeDepartment = updateFieldEvent('department');
        this.submitForm = ev => {
            const username = this.props.user.username
            const email = this.props.user.email
            const name = this.props.user.name
            const password = this.props.user.password
            const roles = this.props.user.roles
            const status = this.props.user.status
            const department = this.props.user.department
            const division = this.props.user.division
            this.props.onSubmit(status, new Date(), username, email, name, password, roles, department, division)
        }
    }

    componentWillMount() {
    }
    componentWillUnmount() {
        this.props.onUnload();
    }
    componentWillReceiveProps(nextProps) {

    }
    render() {
        const user = JSON.parse(window.localStorage.getItem('user'))
        if (!user) {
            return <Redirect to='/login' />;
        } else if (!user.PRIVILEGES_ROLES.includes('Admin')) {
            return <Redirect to='/home' />;
        }
        
        if (this.props.redirect) {
            return <Redirect to={this.props.redirect} />;
        }
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={8}>
                            <p>{this.props.location.search ? this.props.location.search.replace('?message=', '').replaceAll('+', ' ') : ""}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8}>
                            <Card
                                title="Create New User"
                                content={
                                    <form>
                                        <Row>
                                            <Col md={4}>
                                                <FormGroup controlId="formControlsTextarea">
                                                    <ControlLabel>User ID (NIK)</ControlLabel>
                                                    <FormControl
                                                        placeholder="NIK"
                                                        value={this.props.username}
                                                        onChange={this.changeUsername}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={4}>
                                                <FormGroup controlId="formControlsTextarea">
                                                    <ControlLabel>Password</ControlLabel>
                                                    <FormControl
                                                        type="password"
                                                        placeholder="Password"
                                                        value={this.props.password}
                                                        onChange={this.changePassword}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4}>
                                                <FormGroup controlId="formControlsTextarea">
                                                    <ControlLabel>Name</ControlLabel>
                                                    <FormControl
                                                        placeholder="Name"
                                                        value={this.props.name}
                                                        onChange={this.changeName}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={4}>
                                                <FormGroup controlId="formControlsTextarea">
                                                    <ControlLabel>Email</ControlLabel>
                                                    <FormControl
                                                        placeholder="Email"
                                                        type="email"
                                                        value={this.props.email}
                                                        onChange={this.changeEmail}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4}>
                                                <FormGroup controlId="formControlsTextarea">
                                                    <ControlLabel>Division</ControlLabel>
                                                    <FormControl
                                                        placeholder="Division"
                                                        value={this.props.division}
                                                        onChange={this.changeDivision}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={4}>
                                                <FormGroup controlId="formControlsTextarea">
                                                    <ControlLabel>Department</ControlLabel>
                                                    <FormControl
                                                        placeholder="Department"
                                                        value={this.props.department}
                                                        onChange={this.changeDepartment}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <ControlLabel>Role</ControlLabel>
                                                    <FormControl componentClass="select" value={this.props.roles} onChange={this.changeRoles} >
                                                        <option value="Admin">Admin</option>
                                                        <option value="Creator">Creator</option>
                                                        <option value="Executor">Executor</option>
                                                        <option value="Approver">Approver</option>
                                                    </FormControl>
                                                </FormGroup>
                                            </Col>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <ControlLabel>Status</ControlLabel>
                                                    <FormControl componentClass="select" value={this.props.status} onChange={this.changeStatus} >
                                                        <option value="INACTIVE">INACTIVE</option>
                                                        <option value="ACTIVE">ACTIVE</option>
                                                    </FormControl>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Button bsStyle="info" pullRight fill onClick={this.submitForm}>
                                            Submit
                                        </Button>
                                        <div className="clearfix" />
                                    </form>
                                }
                            />
                        </Col>
                    </Row>
                    <Row> <div className="col-md-12">
                        <Link to="/user">
                            <Button bsStyle="info" fill>
                                Back
                        </Button>
                        </Link>
                    </div>
                    </Row>
                </Grid>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(NewUser);
