/* eslint-disable */
import React, { Component } from "react";
import { Grid, Row, Col, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { connect } from 'react-redux';
import agent from '../../agent';
import moment from 'moment';
import { Link, Redirect, withRouter } from 'react-router-dom';

import Card from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";

import {
    VIEW_TICKET_PAGE_UNLOADED,
    REVIEW_TICKET_LOADED,
    REJECT_TICKET,
    UPDATE_FIELD_TICKET,
    APPROVE_TICKET,
    DONE_TICKET
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
    ...state, redirect: state.ticket.redirect,
    ticket: state.ticket.ticket,
    executors: state.ticket.executors,
    description: state.ticket.description,
    executorId: state.ticket.executorId,
    submit: state.ticket.submit,
    documents: state.ticket.documents
});
const mapDispatchToProps = dispatch => ({
    onLoad: (payload) =>
        dispatch({ type: REVIEW_TICKET_LOADED, payload }),
    onUnload: () =>
        dispatch({ type: VIEW_TICKET_PAGE_UNLOADED }),
    onReject: (id, rejectorId, rejectNotes, status) => {
        const param = {
            ticketId: id,
            rejectorId: rejectorId,
            rejectNotes: rejectNotes,
            status: status
        }
        const payload = agent.Ticket.rejectTicket(param)
        const user = JSON.parse(window.localStorage.getItem('user'))
        const params = {
            role: user.PRIVILEGES_ROLES,
            id: user.ID,
            ticketId: id,
            status: 'Rejected'
        }
        agent.Notif.viewUpdate(params)
        dispatch({ type: REJECT_TICKET, payload })
    },
    onApprove: (id, approverId, approveNotes, executorId) => {
        const param = {
            ticketId: id,
            approverId: approverId,
            approveNotes: approveNotes,
            executorId: executorId
        }
        const payload = agent.Ticket.approveTicket(param)
        const user = JSON.parse(window.localStorage.getItem('user'))
        const params = {
            role: user.PRIVILEGES_ROLES,
            id: user.ID,
            ticketId: id,
            status: 'Approved'
        }
        agent.Notif.viewUpdate(params)
        dispatch({ type: APPROVE_TICKET, payload })
    },
    onDone: (id, approverId, approveNotes, executorId) => {
        const param = {
            ticketId: id,
            approverId: approverId,
            approveNotes: approveNotes,
        }
        const payload = agent.Ticket.doneTicket(param)
        const user = JSON.parse(window.localStorage.getItem('user'))
        const params = {
            role: user.PRIVILEGES_ROLES,
            id: user.ID,
            ticketId: id,
            status: 'Done'
        }
        agent.Notif.viewUpdate(params)
        dispatch({ type: DONE_TICKET, payload })
    },
    onUpdateField: (key, value) =>
        dispatch({ type: UPDATE_FIELD_TICKET, key, value })

});

class ReviewTicket extends Component {
    constructor() {
        super()
        const updateFieldEvent = key => ev => this.props.onUpdateField(key, ev.target.value);
        this.changeDescription = updateFieldEvent('description')
        this.changeExecutor = updateFieldEvent('executorId')
        this.submit = (submit, ticketId, userId, description, executorId, status) => ev => {
            ev.preventDefault()
            if (submit === 'approve') {
                this.props.onApprove(ticketId, userId, description, executorId)
            } else if (submit === 'reject') {
                this.props.onReject(ticketId, userId, description, status)
            } else {
                this.props.onDone(ticketId, userId, description, executorId)
            }
        }
        this.clicked = (val) => ev => {
            this.props.onUpdateField('submit', val)
        }
    }
    componentWillMount() {
        this.props.onLoad(Promise.all([
            agent.Ticket.getTicketById(this.props.location.pathname.replace('/reviewTicket/', '')),
            agent.User.getUserByRoles('Executor')
        ]))
    }
    componentWillUnmount() {
        this.props.onUnload();
    }
    render() {
        if (!this.props.ticket) {
            return null;
        }
        if (this.props.redirect) {
            return <Redirect to={this.props.redirect} />;
        }

        const user = JSON.parse(window.localStorage.getItem('user'))
        if (!user) {
            return <Redirect to='/login' />;
        }
        const userId = user.ID
        const ticketId = this.props.ticket[0][0].ID
        const status = this.props.ticket[0][0].STATUS
        if (status !== 'Created' && status !== 'Pending review') {
            return <Redirect to={'/viewTicket/' + ticketId} />;
        }
        const description = this.props.description
        const executorId = this.props.executorId ? this.props.executorId : this.props.executors[0].ID

        let arrayDocs = []
        let docsExecutor = []
        this.props.documents.forEach((docs, idx) => {
            let arr = []
            arr[0] = docs.FILEDATA
            arr[1] = docs.FILENAME
            if (docs.DOCUMENT_TYPES === 'NODIN') {
                arrayDocs[idx] = arr
            } else {
                // executor documents
                docsExecutor[idx] = arr
            }
        })

        let arrayExecutor = []
        this.props.executors.forEach((type, idx) => {
            let arr = []
            arr[0] = type.ID
            arr[1] = type.NAME
            arr[2] = type.USERNAME
            arrayExecutor[idx] = arr
        })

        return (<div className="content">
            <Grid fluid>
                <Row>
                    <Col md={12}>
                        <Card
                            title={`Ticket #${this.props.ticket[0][0].TICKET_ID}`}
                            category={`Created by ${this.props.ticket[0][0].NAME} at ${moment(this.props.ticket[0][0].DATE_CREATED).format('hh:mm, DD MMM YYYY')}`}
                            content={
                                <form onSubmit={this.submit(this.props.submit, ticketId, userId, description, executorId, status)}>
                                    <div>
                                        <div className="typo-line">
                                            <p>
                                                <span className="category">Report Category</span>{`${this.props.ticket[0][0].REPORT_CATEGORY}`}
                                            </p>
                                        </div>
                                        <div className="typo-line">
                                            <p>
                                                <span className="category">Project Title</span>{`${this.props.ticket[0][0].REPORT_TITLE}`}
                                            </p>
                                        </div>
                                        <div className="typo-line">
                                            <p>
                                                <span className="category">Project Name</span>{`${this.props.ticket[0][0].REPORT_NAME}`}
                                            </p>
                                        </div>
                                        <div className="typo-line">
                                            <p>
                                                <span className="category">Uploaded Docs</span>
                                                {arrayDocs.map((prop, key) => {
                                                    return <p><a href={prop[0]} download={prop[1]} key={key}>{prop[1]}</a></p>
                                                })}

                                            </p>
                                        </div>
                                        <div className="typo-line">
                                            <p>
                                                <span className="category">Report Types</span>{`${this.props.ticket[0][0].REPORT_TYPE_ID}`}
                                            </p>
                                        </div>
                                        <div className="typo-line">
                                            <p>
                                                <span className="category">Report Consumer</span>{`${this.props.ticket[0][0].REPORT_CONSUMER_ID}`}
                                            </p>
                                        </div>
                                        {this.props.ticket[0][0].OUTPUT_FORMAT ? <div className="typo-line">
                                            <p>
                                                <span className="category">Output Format</span>{`${this.props.ticket[0][0].OUTPUT_FORMAT}`}
                                            </p>
                                        </div>
                                            : ''}
                                        <div className="typo-line">
                                            <p>
                                                <span className="category">Expected fulfillment</span>{`${moment(this.props.ticket[0][0].EXPECTED_REPORT_FULFILLMENT).format('DD MMM YYYY')}`}
                                            </p>
                                        </div>

                                        <div className="typo-line">
                                            <p>
                                                <span className="category">Description</span>{`${this.props.ticket[0][0].REPORT_DESCRIPTION}`}
                                            </p>
                                        </div>
                                        <div className="typo-line">
                                            <p>
                                                <span className="category">Business Objective</span>{`${this.props.ticket[0][0].BUSINESS_OBJECTIVES}`}
                                            </p>
                                        </div>
                                        {this.props.ticket[0][0].URL ? <div className="typo-line">
                                            <p>
                                                <span className="category">URL</span>
                                                {`${this.props.ticket[0][0].URL}`.indexOf('http') >= 0 ?
                                                    <a href={`${this.props.ticket[0][0].URL}`}>{`${this.props.ticket[0][0].URL}`}</a> :
                                                    <a href={`http://${this.props.ticket[0][0].URL}`}>{`${this.props.ticket[0][0].URL}`}</a>}
                                            </p>
                                        </div> : ''}
                                        {this.props.ticket[0][0].EXECUTOR_URL ? <div className="typo-line">
                                            <p>
                                                <span className="category">Executor URL</span>
                                                {`${this.props.ticket[0][0].EXECUTOR_URL}`.indexOf('http') >= 0 ?
                                                    <a href={`${this.props.ticket[0][0].EXECUTOR_URL}`}>{`${this.props.ticket[0][0].EXECUTOR_URL}`}</a> :
                                                    <a href={`http://${this.props.ticket[0][0].EXECUTOR_URL}`}>{`${this.props.ticket[0][0].EXECUTOR_URL}`}</a>}
                                            </p>
                                        </div> : ''}
                                        {this.props.ticket[0][0].STATUS === 'Pending review' ? <div className="typo-line">
                                            <p>
                                                <span className="category">Result Docs</span>
                                                {docsExecutor.map((prop, key) => {
                                                    return <p><a href={prop[0]} download={prop[1]} key={key}>{prop[1]}</a></p>
                                                })}

                                            </p>
                                        </div> : ''}
                                        {this.props.ticket[0][0].STATUS === 'Created' ?
                                            <div className="typo-line">
                                                <span className="category">Select executor</span>
                                                <FormGroup>
                                                    <FormControl componentClass="select" value={this.props.executorId} onChange={this.changeExecutor} >
                                                        {arrayExecutor.map((prop, key) => {
                                                            return <option value={prop[0]} key={key}>{prop[1]} - {prop[2]}</option>;
                                                        })}
                                                    </FormControl>
                                                </FormGroup>
                                            </div> : ''}
                                        <div className="typo-line">
                                            <span className="category">Notes</span>
                                            <FormGroup controlId="formGroupDescription">
                                                <FormControl
                                                    rows="4"
                                                    componentClass="textarea"
                                                    bsClass="form-control"
                                                    placeholder="Approve or rejection notes"
                                                    value={this.props.description}
                                                    onChange={this.changeDescription}
                                                />
                                            </FormGroup>
                                        </div>
                                        <div className="typo-line">
                                            <span className="category">Action</span>
                                            {this.props.ticket[0][0].STATUS === 'Created' ? <span style={{ marginRight: 10 + 'px' }}>
                                                <Button bsStyle="info" fill type="submit" onClick={this.clicked('approve')}>
                                                    Approve
                                                </Button>
                                            </span> : <span style={{ marginRight: 10 + 'px' }}>
                                                    <Button bsStyle="info" fill type="submit" onClick={this.clicked('finish')}>
                                                        Finish
                                                </Button>
                                                </span>}

                                            <span>
                                                <Button bsStyle="danger" fill type="submit" onClick={this.clicked('reject')}>
                                                    Reject
                                                </Button>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="clearfix" />
                                </form>
                            }
                        />
                    </Col>
                </Row>

                <Row>
                </Row>

                <Row> <div className="col-md-12">
                    <Link to="/ticket">
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


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReviewTicket));
