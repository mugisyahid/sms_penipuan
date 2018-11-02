import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { Grid, Row, Col } from "react-bootstrap";
import { StatsCard } from "../StatsCard/StatsCard.jsx";
import { connect } from 'react-redux';
import agent from "../../agent";


import {
    HOME_PAGE_UNLOADED,
    HOME_PAGE_LOADED
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
    ...state,
    stats: state.ticket.stats
})

const mapDispatchToProps = dispatch => ({
    onLoad: (payload) =>
        dispatch({ type: HOME_PAGE_LOADED, payload }),
    onUnload: () =>
        dispatch({ type: HOME_PAGE_UNLOADED })
});

class HomePage extends Component {


    componentWillMount() {
        const user = JSON.parse(window.localStorage.getItem('user'))

        if (user.PRIVILEGES_ROLES === 'Creator') {
            this.props.onLoad(Promise.all([agent.Ticket.countTicket(user.ID, 'Created'),
            agent.Ticket.countTicket(user.ID, 'Approved'),
            agent.Ticket.countTicket(user.ID, 'In Progress'),
            agent.Ticket.countTicket(user.ID, 'Done')]))
        } else if (user.PRIVILEGES_ROLES === 'Approver') {
            this.props.onLoad(Promise.all([agent.Ticket.countTicketApprover(user.ID, 'Created'),
            agent.Ticket.countTicketApprover(user.ID, 'Approved'),
            agent.Ticket.countTicketApprover(user.ID, 'In Progress'),
            agent.Ticket.countTicketApprover(user.ID, 'Done')]))
        } else if (user.PRIVILEGES_ROLES === 'Executor') {
            this.props.onLoad(Promise.all([agent.Ticket.countTicketExecutor(user.ID, 'Approved'),
            agent.Ticket.countTicketExecutor(user.ID, 'Approved'),
            agent.Ticket.countTicketExecutor(user.ID, 'In Progress'),
            agent.Ticket.countTicketExecutor(user.ID, 'Done')]))
        }
        else {
            this.props.onLoad(Promise.all([agent.Ticket.countTicketAdmin(user.ID, 'Created'),
            agent.Ticket.countTicketAdmin(user.ID, 'Approved'),
            agent.Ticket.countTicketAdmin(user.ID, 'In Progress'),
            agent.Ticket.countTicketAdmin(user.ID, 'Done')]))
        }
    }
    componentWillUnmount() {
        this.props.onUnload();
    }

    render() {
        const u = window.localStorage.getItem('user')
        if (u === 'undefined' || !u) {
            return <Redirect to='/login' />;
        }
        const user = JSON.parse(u)
        const stats = this.props.ticket.stats
        if (stats === 'undefined' || !stats) {
            window.location.reload()
        }
        let statistics = []
        stats.forEach((s, idx) => {
            statistics[idx] = s[0].JUMLAH
        })

        return (
            <div className="content">
                
            </div>

        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
