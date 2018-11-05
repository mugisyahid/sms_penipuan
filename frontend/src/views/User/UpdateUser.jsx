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
    UPDATE_USER_PAGE_UNLOADED,
    UPDATE_USER_BY_ID,
    UPDATE_FIELD_USER,
    UPDATE_USER_PAGE_LOADED,
    LOGOUT
} from '../../constants/actionTypes';

String.prototype.replaceAll = function (searchStr, replaceStr) {
    var str = this;
    // escape regexp special characters in search string
    searchStr = searchStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    return str.replace(new RegExp(searchStr, 'gi'), replaceStr);
};

const mapStateToProps = state => ({ ...state, redirect: state.user.redirect, oldUser: state.user.oldUser });
const mapDispatchToProps = dispatch => ({
    onSubmit: (id, status, createdDate, username, email, name, roles, department, division) => {
        const params = {
            status: status,
            dateUpdated: moment(createdDate).format('YYYY-MM-DD HH:mm:ss'),
            userId: username,
            username: username,
            name: name,
            privilegesRoles: roles,
            contactEmail: email,
            department: department,
            division: division
        }
        const payload = agent.User.updateUser(id, params)
        dispatch({ type: UPDATE_USER_BY_ID, payload })
    },
    onLoad: (payload) =>
        dispatch({ type: UPDATE_USER_PAGE_LOADED, payload }),
    onUnload: () =>
        dispatch({ type: UPDATE_USER_PAGE_UNLOADED }),
    onUpdateField: (key, value) =>
        dispatch({ type: UPDATE_FIELD_USER, key, value }),
    onClickLogout: () =>
        dispatch({ type: LOGOUT })
});

class UpdateUser extends Component {
    constructor() {
        super()
        const updateFieldEvent = key => ev => this.props.onUpdateField(key, ev.target.value);
        this.changeUsername = updateFieldEvent('username');
        this.changeEmail = updateFieldEvent('email');
        this.changeName = updateFieldEvent('name');
        this.changeRoles = updateFieldEvent('roles');
        this.changeStatus = updateFieldEvent('status');
        this.changeDivision = updateFieldEvent('division');
        this.changeDepartment = updateFieldEvent('department');
        this.submitForm = (oldStatus) => ev => {
            const username = this.props.user.username ? this.props.user.username : this.props.oldUser[0][0].USERNAME;
            const email = this.props.user.email ? this.props.user.email : this.props.oldUser[0][0].CONTACT_EMAIL;
            const name = this.props.user.name ? this.props.user.name : this.props.oldUser[0][0].NAME;
            const roles = this.props.user.roles ? this.props.user.roles : this.props.oldUser[0][0].PRIVILEGES_ROLES;
            const status = this.props.user.status ? this.props.user.status : (this.props.oldUser[0][0].STATUS === 'INCOMPLETE' ? 'COMPLETED' : this.props.oldUser[0][0].STATUS);
            const department = this.props.user.department ? this.props.user.department : this.props.oldUser[0][0].DEPARTMENT;
            const division = this.props.user.division ? this.props.user.division : this.props.oldUser[0][0].DIVISION;
            if (oldStatus === 'INCOMPLETE') {
                this.props.onClickLogout()
            }
            this.props.onSubmit(this.props.location.pathname.replace('/updateUser/', ''), status, new Date(), username, email, name, roles, department, division)
        }
    }

    componentWillMount() {
        this.props.onLoad(Promise.all([agent.User.getUserById(this.props.location.pathname.replace('/updateUser/', ''))]))
    }
    componentWillUnmount() {
        this.props.onUnload();
    }
    componentWillReceiveProps(nextProps) {

    }
    render() {
        if (this.props.redirect) {
            return <Redirect to={this.props.redirect} />;
        }
        const user = JSON.parse(window.localStorage.getItem('user'))
        if (!user) {
            return <Redirect to='/login' />;
        } else if (!user.PRIVILEGES_ROLES.includes('Admin') && !user.PRIVILEGES_ROLES.includes('NOT COMPLETED')) {
            return <Redirect to='/home' />;
        }
        if (!this.props.oldUser) {
            return null;
        }

        const status = this.props.oldUser[0][0].STATUS
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
                                title="Update User"
                                content={
                                    <form>
                                        <Row>
                                            <Col md={4}>
                                                <FormGroup controlId="formControlsTextarea">
                                                    <ControlLabel>User ID (NIK)</ControlLabel>
                                                    <FormControl
                                                        placeholder="Generated user id"
                                                        disabled="true"
                                                        defaultValue={this.props.oldUser[0][0].USERNAME}
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
                                                        defaultValue={this.props.oldUser[0][0].NAME}
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
                                                        required
                                                        defaultValue={this.props.oldUser[0][0].CONTACT_EMAIL}
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
                                                        defaultValue={this.props.oldUser[0][0].DIVISION}
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
                                                        defaultValue={this.props.oldUser[0][0].DEPARTMENT}
                                                        value={this.props.department}
                                                        onChange={this.changeDepartment}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        {user.PRIVILEGES_ROLES.includes('Admin') ? <Row>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <ControlLabel>Role</ControlLabel>
                                                    <FormControl componentClass="select" value={this.props.roles} onChange={this.changeRoles} >
                                                        <option value={this.props.oldUser[0][0].PRIVILEGES_ROLES} selected>{this.props.oldUser[0][0].PRIVILEGES_ROLES}</option>
                                                        <option value="Admin" hidden={status === 'INCOMPLETE' ? true : false}>Admin</option>
                                                        <option value="Creator" hidden={this.props.oldUser[0][0].PRIVILEGES_ROLES === 'Creator' ? true : false}>Creator</option>
                                                        <option value="Executor" hidden={this.props.oldUser[0][0].PRIVILEGES_ROLES === 'Executor' ? true : false}>Executor</option>
                                                        <option value="Approver" hidden={this.props.oldUser[0][0].PRIVILEGES_ROLES === 'Approver' ? true : false}>Approver</option>
                                                    </FormControl>
                                                </FormGroup>
                                            </Col>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <ControlLabel>Status</ControlLabel>
                                                    <FormControl componentClass="select" value={this.props.status} onChange={this.changeStatus} >
                                                        <option value={this.props.oldUser[0][0].STATUS} selected>{this.props.oldUser[0][0].STATUS}</option>
                                                        <option value="INACTIVE" hidden={status === 'INCOMPLETE' ? true : false}>INACTIVE</option>
                                                        <option value="ACTIVE" hidden={this.props.oldUser[0][0].STATUS === 'ACTIVE' ? true : false}>ACTIVE</option>
                                                    </FormControl>
                                                </FormGroup>
                                            </Col>
                                        </Row> : ""}


                                        <Button bsStyle="info" pullRight fill onClick={this.submitForm(user.STATUS)}>
                                            Submit
                                        </Button>
                                        <div className="clearfix" />
                                    </form>
                                }
                            />
                        </Col>
                    </Row>
                    {user.PRIVILEGES_ROLES.includes('NOT COMPLETED') ? '' :
                        <Row> <div className="col-md-12">
                            <Link to="/user">
                                <Button bsStyle="info" fill>
                                    Back
                        </Button>
                            </Link>
                        </div>
                        </Row>
                    }
                </Grid>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(UpdateUser);
