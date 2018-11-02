/* eslint-disable */
import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { connect } from 'react-redux';
import agent from '../../agent';
import moment from 'moment';
import { Link, Redirect, withRouter } from 'react-router-dom';

import Card from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";

import {
    VIEW_TICKET_PAGE_UNLOADED,
    GET_TICKET_BY_ID
} from '../../constants/actionTypes';

const mapStateToProps = state => ({ ...state, ticket: state.ticket.ticket, documents: state.ticket.documents });
const mapDispatchToProps = dispatch => ({
    onLoad: (payload) =>
        dispatch({ type: GET_TICKET_BY_ID, payload }),
    onUnload: () =>
        dispatch({ type: VIEW_TICKET_PAGE_UNLOADED })
});

class ViewTicket extends Component {

    componentWillMount() {
        const user = JSON.parse(window.localStorage.getItem('user'))
        const params = {
            role: user.PRIVILEGES_ROLES,
            id: user.ID,
            ticketId: this.props.location.pathname.replace('/viewTicket/', ''),
        }
        agent.Notif.viewUpdate(params)
        this.props.onLoad(Promise.all([agent.Ticket.getTicketById(this.props.location.pathname.replace('/viewTicket/', ''))]))
    }
    componentWillUnmount() {
        this.props.onUnload();
    }
    render() {
        const user = JSON.parse(window.localStorage.getItem('user'))
        if (!user) {
            return <Redirect to='/login' />;
        }
        const roles = user.PRIVILEGES_ROLES

        if (!this.props.ticket) {
            return null;
        }
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
        return (<div className="content">
            <Grid fluid>
                <Row>
                    <Col md={12}>
                        <Card
                            title={`Ticket #${this.props.ticket[0][0].TICKET_ID}`}
                            category={`Created by ${this.props.ticket[0][0].NAME} at ${moment(this.props.ticket[0][0].DATE_CREATED).format('hh:mm, DD MMM YYYY')}`}
                            content={
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
                                    {arrayDocs.size > 0 ? <div className="typo-line">
                                        <p>
                                            <span className="category">Uploaded Docs</span>
                                            {arrayDocs.map((prop, key) => {
                                                return <p><a href={prop[0]} download={prop[1]} key={key}>{prop[1]}</a></p>
                                            })}

                                        </p>
                                    </div> : ''}
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
                                    {this.props.ticket[0][0].CONDITION_LOGIC ? <div className="typo-line">
                                        <p>
                                            <span className="category">Condition Logic</span>{`${this.props.ticket[0][0].CONDITION_LOGIC}`}
                                        </p>
                                    </div> : ''}
                                    {this.props.ticket[0][0].URL ? <div className="typo-line">
                                        <p>
                                            <span className="category">URL</span>
                                            {`${this.props.ticket[0][0].URL}`.indexOf('http') >= 0 ?
                                                <a href={`${this.props.ticket[0][0].URL}`}>{`${this.props.ticket[0][0].URL}`}</a> :
                                                <a href={`http://${this.props.ticket[0][0].URL}`}>{`${this.props.ticket[0][0].URL}`}</a>}
                                        </p>
                                    </div> : ''}
                                    {this.props.ticket[0][0].STATUS === 'Approved' ?
                                        <div>
                                            <div className="typo-line">
                                                <p>
                                                    <span className="category">Approved At</span>{`${moment(this.props.ticket[0][0].DATE_APPROVED).format('hh:mm, DD MMM YYYY')}`}
                                                </p>
                                            </div>
                                            <div className="typo-line">
                                                <p>
                                                    <span className="category">Approved Notes</span>{`${this.props.ticket[0][0].APPROVER_NOTES}`}
                                                </p>
                                            </div>
                                        </div> : ''}
                                    {this.props.ticket[0][0].STATUS === 'Rejected' ?
                                        <div>
                                            <div className="typo-line">
                                                <p>
                                                    <span className="category">Rejected At</span>{`${moment(this.props.ticket[0][0].DATE_REJECTED).format('hh:mm, DD MMM YYYY')}`}
                                                </p>
                                            </div>
                                            <div className="typo-line">
                                                <p>
                                                    <span className="category">Rejected Notes</span>{`${this.props.ticket[0][0].APPROVER_REJECT_NOTES}`}
                                                </p>
                                            </div>
                                        </div> : ''}
                                    {this.props.ticket[0][0].STATUS === 'In Progress' || (roles === 'Creator' && this.props.ticket[0][0].STATUS === 'In Progress') ?
                                        <div>
                                            <div className="typo-line">
                                                <p>
                                                    <span className="category">In progress At</span>{`${moment(this.props.ticket[0][0].DATE_EXECUTED).format('hh:mm, DD MMM YYYY')}`}
                                                </p>
                                            </div>
                                            <div className="typo-line">
                                                <p>
                                                    <span className="category">In progress Notes</span>{`${this.props.ticket[0][0].EXECUTOR_NOTES}`}
                                                </p>
                                            </div>
                                        </div> : ''}
                                    {/* Done By Executor */}
                                    {this.props.ticket[0][0].STATUS === 'Pending review' && roles !== 'Creator' ?
                                        <div>
                                            <div className="typo-line">
                                                <p>
                                                    <span className="category">Done by executor at</span>{`${moment(this.props.ticket[0][0].DATE_FINISH).format('hh:mm, DD MMM YYYY')}`}
                                                </p>
                                            </div>
                                            <div className="typo-line">
                                                <p>
                                                    <span className="category">Executor notes</span>{`${this.props.ticket[0][0].EXECUTOR_FINISH_NOTES}`}
                                                </p>
                                            </div>
                                            <div className="typo-line">
                                                <p>
                                                    <span className="category">Executor URL</span>
                                                    {`${this.props.ticket[0][0].EXECUTOR_URL}`.indexOf('http') >= 0 ?
                                                        <a href={`${this.props.ticket[0][0].EXECUTOR_URL}`}>{`${this.props.ticket[0][0].EXECUTOR_URL}`}</a> :
                                                        <a href={`http://${this.props.ticket[0][0].EXECUTOR_URL}`}>{`${this.props.ticket[0][0].EXECUTOR_URL}`}</a>}
                                                </p>
                                            </div>
                                            <div className="typo-line">
                                                <p>
                                                    <span className="category">Result documents</span>
                                                    {docsExecutor.map((prop, key) => {
                                                        return <p><a href={prop[0]} download={prop[1]} key={key}>{prop[1]}</a></p>
                                                    })}

                                                </p>
                                            </div>
                                        </div> : ''}
                                    {/* Done By Executor */}
                                    {this.props.ticket[0][0].STATUS === 'Done' ?
                                        <div>

                                            <div className="typo-line">
                                                <p>
                                                    <span className="category">Done at</span>{`${moment(this.props.ticket[0][0].DATE_DONE).format('hh:mm, DD MMM YYYY')}`}
                                                </p>
                                            </div>
                                            <div className="typo-line">
                                                <p>
                                                    <span className="category">Done notes</span>{`${this.props.ticket[0][0].DONE_NOTES}`}
                                                </p>
                                            </div>
                                            <div className="typo-line">
                                                <p>
                                                    <span className="category">Executor URL</span>
                                                    {`${this.props.ticket[0][0].EXECUTOR_URL}`.indexOf('http') >= 0 ?
                                                        <a href={`${this.props.ticket[0][0].EXECUTOR_URL}`}>{`${this.props.ticket[0][0].EXECUTOR_URL}`}</a> :
                                                        <a href={`http://${this.props.ticket[0][0].EXECUTOR_URL}`}>{`${this.props.ticket[0][0].EXECUTOR_URL}`}</a>}
                                                </p>
                                            </div>
                                            <div className="typo-line">
                                                <p>
                                                    <span className="category">Result documents</span>
                                                    {docsExecutor.map((prop, key) => {
                                                        return <p><a href={prop[0]} download={prop[1]} key={key}>{prop[1]}</a></p>
                                                    })}

                                                </p>
                                            </div>
                                        </div> : ''}

                                </div>
                            }
                        />
                    </Col>
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


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ViewTicket));
