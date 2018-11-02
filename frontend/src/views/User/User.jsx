/* eslint-disable */
import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import Card from "../../components/Card/Card.jsx";
import { thUserArray } from "../../variables/Variables.jsx";

import Button from "../../components/CustomButton/CustomButton.jsx";

import agent from '../../agent';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import {
  USER_PAGE_UNLOADED,
  GET_USER,
} from '../../constants/actionTypes';

const mapStateToProps = state => ({ ...state, users: state.user.users });
const mapDispatchToProps = dispatch => ({
  onLoad: (payload) =>
    dispatch({ type: GET_USER, payload }),
  onSearchUser: value =>
    dispatch({ type: SEARCH_TICKET }),
  onUnload: () =>
    dispatch({ type: USER_PAGE_UNLOADED })
});

class User extends Component {

  componentWillMount() {
    this.props.onLoad(Promise.all([agent.User.getUser()]))
  }
  componentWillUnmount() {
    this.props.onUnload();
  }
  render() {
    const user = JSON.parse(window.localStorage.getItem('user'))
    if (!user) {
      return <Redirect to='/login' />;
    } else if (!user.PRIVILEGES_ROLES.includes('Admin')) {
      return <Redirect to='/home' />;
    }
    if (!this.props.users) {
      return null;
    }
    let arrayUsers = []
    this.props.users[0].forEach((u, idx) => {
      if (u.NAME !== user.NAME) {
        let arr = []
        arr[0] = u.ID
        arr[1] = u.NAME
        arr[2] = u.USERNAME
        arr[3] = u.PRIVILEGES_ROLES
        arr[4] = u.CONTACT_EMAIL
        arr[5] = u.DEPARTMENT
        arr[6] = u.DIVISION
        arr[7] = u.STATUS
        arrayUsers[idx] = arr
      }
    });
    return (
      <div className="content">
        <div className="col-md-12" style={{ marginBottom: 15 + 'px' }}>
          <Link to="/newUser">
            <Button bsStyle="info" fill type="submit">
              New User
            </Button>
          </Link>
        </div>
        <br />
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="User List"
                category="Here is a subtitle for this table"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        {thUserArray.map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {arrayUsers.map((prop, key) => {
                        return (
                          <tr key={key}>
                            {prop.map((prop, key) => {
                              return <td key={key}>{prop}</td>;
                            })}
                            {/* button action */}
                            <td key={key}>
                              <Link to={`/viewUser/${arrayUsers[key][0]}`}>
                                <Button bsStyle="info" fill type="submit" style={{ marginRight: 5 + 'px' }}>
                                  view
                              </Button>
                              </Link>
                              <Link to={`/updateUser/${arrayUsers[key][0]}`}>
                                <Button bsStyle="default" fill type="submit" style={{ marginRight: 5 + 'px' }}>
                                  edit
                              </Button>
                              </Link>
                              <Link to={`/deleteUser/${arrayUsers[key][0]}`}>
                                <Button bsStyle="danger" fill type="submit">
                                  delete
                              </Button>
                              </Link>
                            </td>
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

export default connect(mapStateToProps, mapDispatchToProps)(User);
