import React, { Component } from "react";
// import {
//     Grid, Row, Col,
//     FormControl,
// } from "react-bootstrap";
import { connect } from 'react-redux';
// import agent from '../../agent';
// import moment from 'moment';
import { /*Link, Redirect,*/ withRouter } from 'react-router-dom';

// import Card from "../../components/Card/Card.jsx";
// import Button from "../../components/CustomButton/CustomButton.jsx";

import {
    UPDATE_DETAIL_SMS_PAGE_UNLOADED,
    // GET_REFERENCE_SMS_BY_MSISDN,
    // UPDATE_FIELD_SMS,
    // UPDATE_SMS_REFERENCE
} from '../../constants/actionTypes';


const mapStateToProps = state => ({ ...state, sms: state.sms });
const mapDispatchToProps = dispatch => ({
    onUnload: () =>
        dispatch({ type: UPDATE_DETAIL_SMS_PAGE_UNLOADED }),

});

class NewPenipu extends Component {

    // constructor() {
    //     super()
    // }
    componentWillMount() {
    }
    componentWillUnmount() {
    }
    render() {

        return (<div className="content">
        </div>)
    }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewPenipu));
