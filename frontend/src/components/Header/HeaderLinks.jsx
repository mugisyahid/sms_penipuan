import React, { Component } from "react";
import { NavItem, Nav, NavDropdown, MenuItem } from "react-bootstrap";
import { Redirect, withRouter, Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import { FIRST_LOAD, LOGOUT } from "../../constants/actionTypes";
import { connect } from 'react-redux';
import moment from 'moment';
// import agent from '../../agent';


const mapStateToProps = state => ({ ...state, notif: state.common.notif });
const mapDispatchToProps = dispatch => ({
  onClickLogout: () =>
    dispatch({ type: LOGOUT }),
  onLoad: (payload) =>
    dispatch({ type: FIRST_LOAD, payload })
});

class HeaderLinks extends Component {
  // eslint-disable-next-line
  constructor() {
    super()
  }

  componentWillMount() {
    // set date in common
    this.props.onLoad()
  }

  componentDidMount() {
    // update every second
  }


  render() {

    const user = window.localStorage.getItem('user')
    if (!user) {
      return <Redirect to='/login' />;
    }
    const logOut = () => {
      confirmAlert({
        title: `Logging out`,
        message: 'Are you sure to do this?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => this.props.onClickLogout()
          },
          {
            label: 'No',
            onClick: () => { }
          }
        ]
      })
    };

    const expired = window.localStorage.getItem('expiredDate')
    if (expired < moment(new Date()).valueOf()) {
      this.props.onClickLogout()
    }


    let arr = []
    let i = 0
    if (this.props.common.notif.length > 0) {
      this.props.common.notif.forEach((n, idx) => {
        // if (user.PRIVILEGES_ROLES === 'Creator' && n.STATUS !== 'Created') {
        //   arr[i++] = n
        // } else if (user.PRIVILEGES_ROLES === 'Approver') {
        //   arr[i++] = n
        // } else {
        arr[i++] = n
        // }
      })
    }

    const notification = (
      <div>
        <i className="fa fa-globe" />
        <b className="caret" />
        <span className="notification">{arr.length}</span>
        <p className="hidden-lg hidden-md">Notification</p>
      </div>
    );

    return (
      <div>
        {
          <div>
            <Nav>
              <NavItem eventKey={1} href="localhost:4000/sms_penipuan/home">
                <i className="fa fa-dashboard" />
                <p className="hidden-lg hidden-md">Home</p>
              </NavItem>
              <NavDropdown
                title={notification}
                noCaret
                id="basic-nav-dropdown"
              >
                <MenuItem>Notification</MenuItem>
                <MenuItem divider />
                {arr.map((prop, key) => {
                  return <MenuItem><Link to={`/viewTicket/${prop.TICKET_ID}`}>{prop.TICKET}</Link></MenuItem>
                })}

              </NavDropdown>
            </Nav>
            <Nav pullRight>
              <NavDropdown
                eventKey={2}
                title="Profile"
                id="basic-nav-dropdown-right"
              >
                <MenuItem eventKey={2.1}>Logged in as: {user ? user.substring(1, user.length - 1) : ""}</MenuItem>
              </NavDropdown>
              <NavItem onClick={logOut}>
                Log out
          </NavItem>
            </Nav>
          </div>
        }
      </div>
    );
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderLinks));