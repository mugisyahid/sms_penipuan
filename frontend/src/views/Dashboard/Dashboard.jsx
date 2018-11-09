import React, { Component } from "react";
import {
  Grid, Row, Col, Table, FormGroup,
  ControlLabel, FormControl, Checkbox, Pagination,
  Modal
} from "react-bootstrap";
import Card from "../../components/Card/Card";
import Button from "../../components/CustomButton/CustomButton";
import { connect } from 'react-redux';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import

import agent from '../../agent';

import {
  HOME_PAGE_UNLOADED,
  HOME_PAGE_LOADED,
  UPDATE_SEARCH_SMS,
  UPDATE_SEARCH_SMS_PAGE,
  UPDATE_SMS_REFERENCE,
  POP_UP_MODAL
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
  ...state,
  sms: state.sms
})

const mapDispatchToProps = dispatch => ({
  onLoad: (payload) =>
    dispatch({ type: HOME_PAGE_LOADED, payload }),
  onUnload: () =>
    dispatch({ type: HOME_PAGE_UNLOADED }),
  onUpdateField: (key, value) =>
    dispatch({ type: UPDATE_SEARCH_SMS, key, value }),
  onChangePage: (value) =>
    dispatch({ type: UPDATE_SEARCH_SMS_PAGE, value }),
  onUpdateReference: (value) =>
    dispatch({ type: UPDATE_SMS_REFERENCE, value }),
  onPopup: (value, arr) =>
    dispatch({ type: POP_UP_MODAL, value, arr }),
});



class Dashboard extends Component {

  constructor() {
    super()
    const updateFieldEvent = key => ev => this.props.onUpdateField(key, ev.target.value);
    this.changeSearchMsisdn = updateFieldEvent('changeSearchMsisdn')
    this.changeSearchCount = updateFieldEvent('changeSearchCount')
    this.changeSearchJumlah = updateFieldEvent('changeSearchJumlah')
    this.changeSearchStatus = updateFieldEvent('changeSearchStatus')
    this.changeStatus = updateFieldEvent('changeStatus')
    this.changeselectedMSISDN = updateFieldEvent('selectedMSISDN')
    this.changePage = (value) => ev => {
      ev.preventDefault()
      this.props.onChangePage(value)
    }
    this.updateReference = (value) => {
      let param = {
        msisdn: '',
        updater: window.localStorage.getItem('user').substring(1, window.localStorage.getItem('user').length - 1),
        status: this.props.sms.changeStatus
      }
      let arr = value.split(',')
      let arrResult = []
      arr.forEach(element => {
        let newJson = JSON.parse(JSON.stringify(param))
        newJson.msisdn = element
        arrResult.push(newJson)
      })
      this.handleShow(arrResult)
      this.clearCheckbox()
      const res = agent.Sms.updateReference(arrResult)
      this.props.onUpdateReference(res)
    }
  }

  componentWillMount() {
    this.props.onLoad(Promise.all([agent.Sms.getPenipu(0, 10), agent.Sms.countPenipu()]))
  }
  componentWillUnmount() {
    this.props.onUnload();
  }

  checkboxEvent = (param, existingValue, isChecked, value) => {
    let arr = existingValue.split(',')
    if (isChecked) {
      arr.push(value)
    } else {
      // remove
      delete arr[arr.indexOf(value)]
    }
    if (arr[0] === "") {
      arr.splice(0, 1)
    }
    let payload = arr.join()
    this.props.onUpdateField(param, payload)
  }

  clearCheckbox = () => {
    // to be implemented
    document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false)
    this.props.onUpdateField('selectedMSISDN', '')
  }


  handleClose = () => {
    this.props.onPopup(false, null)
  }

  handleShow = (value) => {
    this.props.onPopup(true, value)
  }


  render() {
    const updateSms = () => {
      if (this.props.sms.selectedMSISDN) {
        confirmAlert({
          title: `Update Penipu`,
          message: `Update status Penipu ${this.props.sms.selectedMSISDN} to  ${this.props.sms.changeStatus}`,
          buttons: [
            {
              label: 'Yes',
              onClick: () => { this.updateReference(this.props.sms.selectedMSISDN) }
            },
            {
              label: 'No',
              onClick: () => { }
            }
          ]
        })
      } else {
        confirmAlert({
          title: `Update Penipu`,
          message: `Please select the MSISDN above`,
          buttons: [
            {
              label: 'Ok',
              onClick: () => { }
            }
          ]
        })

      }
    }

    const u = window.localStorage.getItem('user')
    if (u === 'undefined' || !u) {
      return <Redirect to='/login' />;
    }

    if (!this.props.sms.listPenipu) {
      return null;
    }
    const smsTable = ["No", "MSISDN Penipu", "Jumlah Pelapor", "status", "Pilih"]

    const selectedMSISDN = this.props.sms.selectedMSISDN ? this.props.sms.selectedMSISDN : ''

    const searchMsisdn = this.props.sms.changeSearchMsisdn ? this.props.sms.changeSearchMsisdn : ''
    const searchJumlah = this.props.sms.changeSearchJumlah ? this.props.sms.changeSearchJumlah : 0
    const searchStatus = this.props.sms.changeSearchStatus ? this.props.sms.changeSearchStatus : 'All'

    let issearchJumlah = true
    let issearchMsisdn = true
    let issearchStatus = true

    let arraySms = []
    let index = 1 * +this.props.sms.currentPage * +this.props.sms.changeSearchCount - (+this.props.sms.changeSearchCount - 1)
    const limit = +this.props.sms.changeSearchCount
    let increment = 0
    let firstIdx = index
    let lastIdx = index + +this.props.sms.changeSearchCount
    let counterElm = 0

    console.log(searchStatus)
    console.log(searchStatus === "Empty")
    this.props.sms.listPenipu.some((u, idx) => {
      let arr = []

      if (searchMsisdn) {
        if (String(u.msisdn_penipu).indexOf(searchMsisdn) < 0) {
          issearchMsisdn = false
        }
      }

      if (searchStatus !== "All") {
        if (searchStatus === "Empty") {
          if (String(u.status) !== "") {
            issearchStatus = false
          }
        } else if (String(u.status).indexOf(searchStatus) < 0) {
          issearchStatus = false
        }
      }

      if (searchJumlah > 0) {
        if (+searchJumlah !== +u.jumlah_pelapor) {
          issearchJumlah = false
        }
      }

      if (issearchJumlah && issearchMsisdn && issearchStatus) {
        counterElm++
        if (counterElm >= firstIdx && counterElm < lastIdx) {
          increment++
          arr[0] = index++
          arr[1] = u.msisdn_penipu
          arr[2] = u.jumlah_pelapor
          arr[3] = u.status
          arraySms[idx] = arr
        }
      }

      issearchJumlah = true
      issearchMsisdn = true
      issearchStatus = true
      return increment === limit
    })

    let arrayResult = []
    const resultTable = ["No", "MSISDN", "Status", "Updater"]
    if (typeof this.props.sms.result !== 'undefined' && this.props.sms.result) {
      let index2 = 1
      this.props.sms.result.forEach((u, idx) => {
        let arr = []
        arr[0] = index2++
        arr[1] = u.msisdn
        arr[2] = u.status
        arr[3] = u.updater
        arrayResult[idx] = arr
      })
    }

    return (
      <div className="content">
        <div style={{ marginBottom: 15 + 'px' }}>
          {/* <p>{this.props.user.errors ? <font color="red">{this.props.user.errors}</font> : ""}</p> */}
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
                        <th>
                          <FormGroup>
                            <ControlLabel>Show</ControlLabel>
                            <FormControl componentClass="select" defaultValue={this.props.sms.changeSearchCount} onChange={this.changeSearchCount} >
                              <option value={10} key={10}>10</option>
                              <option value={25} key={25}>25</option>
                              <option value={50} key={50}>50</option>
                              <option value={100} key={100}>100</option>
                            </FormControl>
                          </FormGroup>
                        </th>
                        <th>
                          <FormGroup controlId="formControlsUploadFiles">
                            <ControlLabel>MSISDN</ControlLabel>
                            <FormControl
                              type="text"
                              defaultValue={this.props.sms.changeSearchMsisdn}
                              onChange={this.changeSearchMsisdn}
                              placeholder="msisdn"
                              autoComplete="off"
                            />
                          </FormGroup>
                        </th>
                        <th>
                          <FormGroup controlId="formControlsUploadFiles">
                            <ControlLabel>Jumlah Laporan</ControlLabel>
                            <FormControl
                              type="number"
                              defaultValue={this.props.sms.changeSearchJumlah}
                              onChange={this.changeSearchJumlah}
                              placeholder="msisdn"
                              autoComplete="off"
                            />
                          </FormGroup>
                        </th>
                        <th>
                          <FormGroup>
                            <ControlLabel>Status</ControlLabel>
                            <FormControl componentClass="select" defaultValue={this.props.sms.changeSearchStatus} onChange={this.changeSearchStatus} >
                              <option value={'All'} key={5}>All</option>
                              <option value={'Empty'} key={10}>Empty</option>
                              <option value={'Follow Up'} key={25}>Follow Up</option>
                              <option value={'Blocked'} key={50}>Blocked</option>
                            </FormControl>
                          </FormGroup>
                        </th>
                      </tr>
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
                            {prop.map((p, k) => {
                              if (k === 1) {
                                return <td key={k}><Link to={`/view/penipu/${p}`}>
                                  {p}
                                </Link></td>;
                              } else {
                                return <td key={k}>{p}</td>;
                              }
                            })}
                            {/* button action */}
                            <td key={key}>
                              {/* <Link to={`/update/penipu/${arraySms[key][1]}`}>
                                <Button bsStyle="default" fill type="submit" style={{ marginRight: 5 + 'px' }}>
                                  update
                              </Button>
                              </Link> */}
                              <FormGroup>
                                <Checkbox inline onClick={e => this.checkboxEvent('selectedMSISDN', selectedMSISDN, e.target.checked, arraySms[key][1])}></Checkbox>
                              </FormGroup>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                }
              />
              <div className="col-md-12">
                <div className="col-md-4">
                  <Pagination style={{ margin: "5px 0px" }}>
                    <Pagination.First onClick={this.changePage('first')} />
                    <Pagination.Prev onClick={this.changePage('prev')} />
                    <Pagination.Item active>{this.props.sms.currentPage}</Pagination.Item>
                    <Pagination.Item onClick={this.changePage(this.props.sms.currentPage + 1)}>{(this.props.sms.currentPage + 1)}</Pagination.Item>
                    <Pagination.Item onClick={this.changePage(this.props.sms.currentPage + 2)}>{(this.props.sms.currentPage + 2)}</Pagination.Item>
                    <Pagination.Ellipsis />
                    <Pagination.Item onClick={this.changePage(this.props.sms.page)}>{this.props.sms.page}</Pagination.Item>
                    <Pagination.Next onClick={this.changePage('next')} />
                    <Pagination.Last onClick={this.changePage('last')} />
                  </Pagination>
                </div>
                <div className="col-md-1"></div>
                <div className="col-md-4">
                  <FormGroup>
                    <FormControl componentClass="select" defaultValue={this.props.sms.changeStatus} onChange={this.changeStatus} >
                      <option value={'Follow Up'} key={10}>Follow Up</option>
                      <option value={'Blocked'} key={100}>Blocked</option>
                    </FormControl>
                  </FormGroup>
                </div>
                <div className="col-md-1" style={{ padding: 'initial' }}>
                  <Button bsStyle="info" fill type="submit" onClick={updateSms}>
                    Update
                </Button>
                </div>
                <div className="col-md-2" style={{ padding: 'initial' }}>
                  <Button bsStyle="danger" fill type="submit" onClick={this.clearCheckbox}>
                    Clear Selected
                </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Grid>

        <Modal show={this.props.sms.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update Report</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Grid fluid>
              <Row>
                <Col md={12}>
                  <Card
                    title="Result List"
                    category=""
                    ctTableFullWidth
                    ctTableResponsive
                    content={
                      <Table striped hover style={{ textAlign: 'center' }}>
                        <thead>
                          <tr>
                            {resultTable.map((prop, key) => {
                              return <th key={key} style={{ textAlign: 'center' }}>{prop}</th>;
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {arrayResult.map((prop, key) => {
                            return (
                              <tr key={key}>
                                {prop.map((p, k) => {
                                  return <td key={k}>{p}</td>;
                                })}
                              </tr>
                            )
                          })}
                        </tbody>
                      </Table>
                    }
                  />
                </Col>
              </Row>
            </Grid>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>

      </div >
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));