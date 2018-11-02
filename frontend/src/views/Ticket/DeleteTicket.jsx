/* eslint-disable */
import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import { connect } from 'react-redux';
import agent from '../../agent';
import moment from 'moment';
import { Link, Redirect, withRouter } from 'react-router-dom';

import Card from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

import {
    DELETE_TICKET_PAGE_UNLOADED,
    GET_TICKET_BY_ID,
    DELETE_TICKET_BY_ID
} from '../../constants/actionTypes';

const mapStateToProps = state => ({ ...state, ticket: state.ticket.ticket, redirect: state.ticket.redirect });
const mapDispatchToProps = dispatch => ({
    onLoad: (payload) =>
        dispatch({ type: GET_TICKET_BY_ID, payload }),
    onUnload: () =>
        dispatch({ type: DELETE_TICKET_PAGE_UNLOADED }),
    onClickDelete: payload =>
        dispatch({ type: DELETE_TICKET_BY_ID, payload })
});

class DeleteTicket extends Component {
    componentWillMount() {
        this.props.onLoad(Promise.all([agent.Ticket.getTicketById(this.props.location.pathname.replace('/deleteTicket/', ''))]))
    }
    componentWillUnmount() {
        this.props.onUnload();
    }
    render() {
        const user = JSON.parse(window.localStorage.getItem('user'))
        if (!this.props.ticket) {
            return null;
        }
        if (this.props.redirect) {
            return <Redirect to={this.props.redirect} />;
        }

        if (user.PRIVILEGES_ROLES === 'Creator') {
            const del = () => {
                confirmAlert({
                    title: `Delete Ticket`,
                    message: `Are you sure want to delete ${this.props.ticket[0][0].TICKET_ID}?`,
                    buttons: [
                        {
                            label: 'Yes',
                            onClick: () => this.props.onClickDelete(agent.Ticket.deleteTicketById(this.props.location.pathname.replace('/deleteTicket/', '')))
                        },
                        {
                            label: 'No',
                            onClick: () => { }
                        }
                    ]
                })
            };
            return (<div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title={`Ticket #${this.props.ticket[0][0].TICKET_ID}`}
                                category={`Created by ${this.props.ticket[0][0].NAME} at ${moment(this.props.ticket[0][0].DATE_CREATED).format('hh:mm, DD MMM YYYY')}`}
                                content={
                                    <div >
                                        <div className="typo-line">
                                            <p>
                                                <span className="category">Description</span>{`${this.props.ticket[0][0].REPORT_DESCRIPTION}`}
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
                        <Link to="/ticket">
                            <Button bsStyle="info" fill type="submit">
                                Back
                        </Button>
                        </Link>
                    </div>
                    </Row>
                </Grid>

            </div>);
        } else {
            return (
                <div className="content">
                    <p> You can't delete ticket </p>
                    <Link to="/ticket">
                        <Button bsStyle="info" fill type="submit">
                            Back
                    </Button>
                    </Link>
                </div>
            );
        }
    }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DeleteTicket));
