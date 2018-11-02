/* eslint-disable */
import React, { Component } from "react";
import { Redirect, withRouter} from 'react-router-dom';
import { Grid, Row, Col } from "react-bootstrap";
import { StatsCard } from "../../components/StatsCard/StatsCard.jsx";
import { connect } from 'react-redux';
import agent from '../../agent';

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



class Dashboard extends Component {

  componentWillMount() {
    const user = JSON.parse(window.localStorage.getItem('user'))

    if (user.PRIVILEGES_ROLES === 'Creator') {
      this.props.onLoad(Promise.all([
        agent.Ticket.countTicket(user.ID, 'Created'),
        agent.Ticket.countTicket(user.ID, 'Approved'),
        agent.Ticket.countTicket(user.ID, 'Rejected'),
        agent.Ticket.countTicket(user.ID, 'In Progress'),
        agent.Ticket.countTicket(user.ID, 'Pending review'),
        agent.Ticket.countTicket(user.ID, 'Done'),
        agent.Ticket.countTicket(user.ID, 'All'),
        agent.Ticket.countAll()]))
    } else if (user.PRIVILEGES_ROLES === 'Approver') {
      this.props.onLoad(Promise.all([
        agent.Ticket.countTicketApprover(user.ID, 'Created'),
        agent.Ticket.countTicketApprover(user.ID, 'Approved'),
        agent.Ticket.countTicketApprover(user.ID, 'Rejected'),
        agent.Ticket.countTicketApprover(user.ID, 'In Progress'),
        agent.Ticket.countTicketApprover(user.ID, 'Pending review'),
        agent.Ticket.countTicketApprover(user.ID, 'Done'),
        agent.Ticket.countTicketApprover(user.ID, 'All')]))
    } else if (user.PRIVILEGES_ROLES === 'Executor') {
      this.props.onLoad(Promise.all([agent.Ticket.countTicketExecutor(user.ID, 'Approved'),
      agent.Ticket.countTicketExecutor(user.ID, 'In Progress'),
      agent.Ticket.countTicketExecutor(user.ID, 'Pending review'),
      agent.Ticket.countTicketExecutor(user.ID, 'Done'),
      agent.Ticket.countTicketExecutor(user.ID, 'All'),
      agent.Ticket.countAll()]))
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

    return (
      <div className="content">
     
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));

