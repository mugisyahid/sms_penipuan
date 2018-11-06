import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import Card from "../../components/Card/Card";
import Button from "../../components/CustomButton/CustomButton";
import { connect } from 'react-redux';
import { Link, Redirect, withRouter } from 'react-router-dom';

import agent from '../../agent';

import {
  HOME_PAGE_UNLOADED,
  HOME_PAGE_LOADED
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state,
  sms: state.sms
})

const mapDispatchToProps = dispatch => ({
  onLoad: (payload) =>
    dispatch({ type: HOME_PAGE_LOADED, payload }),
  onUnload: () =>
    dispatch({ type: HOME_PAGE_UNLOADED })
});



class Dashboard extends Component {

  componentWillMount() {
    this.props.onLoad(Promise.all([agent.Sms.getPenipu(0, 10)]))
  }
  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {

    const u = window.localStorage.getItem('user')
    if (u === 'undefined' || !u) {
      return <Redirect to='/login' />;
    }

    if (!this.props.sms.listPenipu) {
      return null;
    }
    const smsTable = ["No", "MSISDN Penipu", "Jumlah Pelapor", "Action"]

    let arraySms = []
    let index = 1
    this.props.sms.listPenipu.forEach((u, idx) => {
      let arr = []
      arr[0] = index++
      arr[1] = u.msisdn_penipu
      arr[2] = u.jumlah_pelapor
      arraySms[idx] = arr
    });

    return (
      <div className="content">
        <div className="col-md-12" style={{ marginBottom: 15 + 'px' }}>
          {/* <p>{this.props.user.errors ? <font color="red">{this.props.user.errors}</font> : ""}</p> */}
          <Link to="/newCategory">
            <Button bsStyle="info" fill type="submit">
              New Entry
            </Button>
          </Link>
        </div>
        <br />
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="SMS List"
                category=""
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover style={{ textAlign: 'center' }}>
                    <thead>
                      <tr>
                        {smsTable.map((prop, key) => {
                          return <th key={key} style={{ textAlign: 'center' }}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {arraySms.map((prop, key) => {
                        return (
                          <tr key={key}>
                            {prop.map((prop, key) => {
                              return <td key={key}>{prop}</td>;
                            })}
                            {/* button action */}
                            <td key={key}>
                              <Link to={`/view/penipu/${arraySms[key][1]}`}>
                                <Button bsStyle="info" fill type="submit" style={{ marginRight: 5 + 'px' }}>
                                  view
                              </Button>
                              </Link>
                              <Link to={`/update/penipu/${arraySms[key][1]}`}>
                                <Button bsStyle="default" fill type="submit" style={{ marginRight: 5 + 'px' }}>
                                  update
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));