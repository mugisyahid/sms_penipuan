/* eslint-disable */
import React, { Component } from "react";
import {
  Grid, Row, Col, Table,
  FormGroup, FormControl, ControlLabel
} from "react-bootstrap";
import moment from 'moment';
import Card from "../../components/Card/Card.jsx";
import { thArray } from "../../variables/Variables.jsx";

import Button from "../../components/CustomButton/CustomButton.jsx";

import agent from '../../agent';
import { connect } from 'react-redux';
import { Link, Redirect, withRouter } from 'react-router-dom';

import {
  TICKET_PAGE_UNLOADED,
  GET_TICKET_BY_USER,
  SEARCH_TICKET,
  GET_TICKET,
  UPDATE_SEARCH_TICKET
} from '../../constants/actionTypes';

const mapStateToProps = state => ({ ...state, tickets: state.ticket.tickets });
const mapDispatchToProps = dispatch => ({
  onLoad: (payload) =>
    dispatch({ type: GET_TICKET_BY_USER, payload }),
  onLoadAll: (payload) =>
    dispatch({ type: GET_TICKET, payload }),
  onSearchTicket: value =>
    dispatch({ type: SEARCH_TICKET }),
  onUnload: () =>
    dispatch({ type: TICKET_PAGE_UNLOADED }),
  onUpdateField: (key, value) =>
    dispatch({ type: UPDATE_SEARCH_TICKET, key, value }),
});

class Ticket extends Component {
  constructor() {
    super()
    const updateFieldEvent = key => ev => this.props.onUpdateField(key, ev.target.value);
    this.changeSearchStatus = updateFieldEvent('searchStatus')
    this.changeReportName = updateFieldEvent('searchReportName')
    this.changeReportTitle = updateFieldEvent('searchReportTitle')
  }
  componentWillMount() {
    const user = JSON.parse(window.localStorage.getItem('user'))
    const roles = user.PRIVILEGES_ROLES
    if (roles.includes('Creator')) {
      this.props.onLoad(Promise.all([agent.Ticket.getTicketByUserId(JSON.parse(window.localStorage.getItem('user')).ID)]))
    } else if (roles.includes('Admin')) {
      this.props.onLoadAll(Promise.all([agent.Ticket.getTicket()]))
    } else if (roles.includes('Approver')) {
      this.props.onLoad(Promise.all([agent.Ticket.getTicketByStatus(JSON.parse(window.localStorage.getItem('user')).ID, 'Rejected, Approved, In Progress, Rejected by Executor, Pending review, Done')]))
    } else {
      this.props.onLoad(Promise.all([agent.Ticket.getTicketByStatusExecutor(JSON.parse(window.localStorage.getItem('user')).ID, 'Approved, In Progress, Rejected by Executor, Pending review, Done')]))
    }

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

    if (!this.props.tickets) {
      return null;
    }


    const searchStatus = this.props.ticket.searchStatus ? this.props.ticket.searchStatus : 'All'
    const searchReportName = this.props.ticket.searchReportName ? this.props.ticket.searchReportName : ''
    const searchReportTitle = this.props.ticket.searchReportTitle ? this.props.ticket.searchReportTitle : ''

    let isValidStatus = true
    let isValidReportName = true
    let isValidReportTitle = true

    let arrayTicket = []
    let i = 0
    this.props.tickets[0].forEach((ticket, idx) => {
      let arr = []
      arr[0] = ticket.ID
      arr[1] = ticket.TICKET_ID
      arr[2] = ticket.NAME
      arr[3] = ticket.REPORT_TITLE
      arr[4] = ticket.REPORT_NAME
      arr[5] = ticket.REPORT_DESCRIPTION
      arr[6] = moment(ticket.DATE_CREATED).format('hh:mm, DD MMM YYYY')
      arr[7] = (ticket.STATUS === "Pending review" && roles === 'Creator') ? 'In Progress' : ticket.STATUS

      if (searchReportTitle) {
        if (String(ticket.REPORT_TITLE).indexOf(searchReportTitle) < 0) {
          isValidReportTitle = false
        }
      }
      if (searchReportName) {
        if (String(ticket.REPORT_NAME).indexOf(searchReportName) < 0) {
          isValidReportName = false
        }
      }
      if (searchStatus !== 'All') {
        if (arr[7] !== searchStatus) {
          isValidStatus = false
        }
      }

      if (isValidReportName && isValidStatus && isValidReportTitle) {
        arrayTicket[i++] = arr
      }
      // reset
      isValidStatus = true
      isValidReportName = true
      isValidReportTitle = true
    })

    return (
      <div className="content">
        {(roles === 'Creator') ? <div className="col-md-12" style={{ marginBottom: 15 + 'px' }}>
          <Link to="/newTicket">
            <Button bsStyle="info" fill type="submit">
              New Ticket
            </Button>
          </Link>
        </div> : <div> </div>}
        <br />
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Ticket List"
                category="Here is a subtitle for this table"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>
                          <FormGroup controlId="formControlsUploadFiles">
                            <ControlLabel>Report Title</ControlLabel>
                            <FormControl
                              type="text"
                              value={this.props.searchReportTitle}
                              onChange={this.changeReportTitle}
                              placeholder="Project Title"
                              autoComplete="off"
                            />
                          </FormGroup>
                        </th>
                        <th>
                          <FormGroup controlId="formControlsUploadFiles">
                            <ControlLabel>Report Name</ControlLabel>
                            <FormControl
                              type="text"
                              value={this.props.searchReportName}
                              onChange={this.changeReportName}
                              placeholder="Project Name"
                              autoComplete="off"
                            />
                          </FormGroup>
                        </th>
                        <th>
                          <FormGroup>
                            <ControlLabel>Status</ControlLabel>
                            <FormControl componentClass="select" value={this.props.searchStatus} onChange={this.changeSearchStatus} >
                              <option value={'All'} key={'All'}>All</option>
                              <option value={'Created'} key={'Created'}>Created</option>
                              <option value={'Approved'} key={'Approved'}>Approved</option>
                              <option value={'Rejected'} key={'Rejected'}>Rejected</option>
                              <option value={'In Progress'} key={'In Progress'}>In Progress</option>
                              {roles === 'Creator' ? '' : <option value={'Pending review'} key={'Pending review'}>Pending review</option>}
                              <option value={'Done'} key={'Done'}>Done</option>
                            </FormControl>
                          </FormGroup>
                        </th>
                      </tr>
                      <tr>
                        {thArray.map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {arrayTicket.map((prop, key) => {
                        return (
                          <tr key={key}>
                            {prop.map((prop, key) => {
                              return <td key={key}>{prop}</td>;
                            })}
                            {/* creator */}
                            {
                              roles === 'Creator' ? <td key={key}>
                                <Link to={`/viewTicket/${arrayTicket[key][0]}`}>
                                  <Button bsStyle="info" fill type="submit" style={{ marginRight: 5 + 'px' }}>
                                    view
                              </Button>
                                </Link>
                                {`${arrayTicket[key][7]}` === 'Created' || `${arrayTicket[key][7]}` === 'Rejected' ? <Link to={`/updateTicket/${arrayTicket[key][0]}`}>
                                  <Button bsStyle="default" fill type="submit" style={{ marginRight: 5 + 'px' }}>
                                    edit
                              </Button>
                                </Link> : ''}

                                {`${arrayTicket[key][7]}` === 'Created' ? <Link to={`/deleteTicket/${arrayTicket[key][0]}`}>
                                  <Button bsStyle="danger" fill type="submit">
                                    delete
                              </Button>
                                </Link> : ''}

                              </td> : ''
                            }
                            {/* approver */}
                            {roles === 'Approver' ? <td key={key}>
                              {
                                roles === 'Approver' && arrayTicket[key][7] !== 'Created' ?
                                  <Link to={`/viewTicket/${arrayTicket[key][0]}`}>
                                    <Button bsStyle="info" fill type="submit" style={{ marginRight: 5 + 'px' }}>
                                      view
                              </Button>
                                  </Link> : ''
                              }
                              {
                                roles === 'Approver' && (arrayTicket[key][7] === 'Created' || arrayTicket[key][7] === 'Pending review') ?
                                  <Link to={`/reviewTicket/${arrayTicket[key][0]}`}>
                                    <Button bsStyle="info" fill type="submit" style={{ marginRight: 5 + 'px' }}>
                                      Review
                              </Button>
                                  </Link>
                                  : ''
                              }
                            </td> : ''}

                            {/* executor */}
                            {roles === 'Executor' ? <td key={key}>

                              {arrayTicket[key][7] !== 'Approved' ? <Link to={`/viewTicket/${arrayTicket[key][0]}`}>
                                <Button bsStyle="info" fill type="submit" style={{ marginRight: 5 + 'px' }}>
                                  view
                              </Button>
                              </Link> : ''}

                              {(arrayTicket[key][7] === 'Approved' || arrayTicket[key][7] === 'In Progress') ? <Link to={`/executeTicket/${arrayTicket[key][0]}`}>
                                <Button bsStyle="info" fill type="submit" style={{ marginRight: 5 + 'px' }}>
                                  Review
                              </Button>
                              </Link> : ''}
                            </td> : ''}
                          </tr>
                        );
                      })}

                    </tbody>
                  </Table>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Ticket));
