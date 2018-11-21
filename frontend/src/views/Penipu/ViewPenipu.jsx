/* eslint-disable */
import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import { connect } from 'react-redux';
import agent from '../../agent';
import moment from 'moment';
import { Link, Redirect, withRouter } from 'react-router-dom';

import Card from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";
import ReactLoading from "react-loading";

import {
    VIEW_DETAIL_SMS_PAGE_UNLOADED,
    GET_DETAIL_SMS_BY_MSISDN
} from '../../constants/actionTypes';

const mapStateToProps = state => ({ ...state, sms: state.sms });
const mapDispatchToProps = dispatch => ({
    onLoad: (payload) =>
        dispatch({ type: GET_DETAIL_SMS_BY_MSISDN, payload }),
    onUnload: () =>
        dispatch({ type: VIEW_DETAIL_SMS_PAGE_UNLOADED })
});

class ViewPenipu extends Component {

    componentWillMount() {
        const target = this.props.location.pathname.replace('/view/penipu/', '')
        const msisdn = target.indexOf('62') === 0 ? target.substring(2, target.length) : target.substring(1, target.length)
        this.props.onLoad(Promise.all([agent.Sms.getDetailSMS(msisdn)]))
    }
    componentWillUnmount() {
        this.props.onUnload();
    }
    render() {
        if (!this.props.sms.detail) {
            return (<div className="content">
                <Grid fluid classNames="pagination-centered">
                    <Row>
                        <Col md={12}>
                            <Card
                                title="Detail Penipuan"
                                category=""
                                ctTableFullWidth
                                ctTableResponsive
                                content={
                                    <div style={{ margin: 'auto', justifyContent: 'center', display: 'flex' }}> <ReactLoading type="spin" color="#000000" height={'3%'} width={'3%'} /> </div>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>
            </div>)
        }

        const smsTable = ["Id", "target", "pelapor", "content", "date", "uploader", "source"]

        let i = 1
        let arraySms = []
        this.props.sms.detail.forEach((u, idx) => {
            let arr = []
            arr[0] = i++
            arr[1] = u.MSISDN_TARGET
            arr[2] = u.MSISDN_PELAPOR
            arr[3] = u.CONTENT
            arr[4] = moment(u.DATE_SYSTEM).format('hh:mm, DD MMM YYYY')
            arr[5] = u.USER_ID
            arr[6] = u.SOURCE
            arraySms[idx] = arr
        });


        return (<div className="content">
            <Grid fluid>
                <Row>
                    <Col md={12}>
                        <Card
                            title={`Detail Penipuan oleh ${this.props.location.pathname.replace('/view/penipu/', '')}`}
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
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            }
                        />
                    </Col>
                </Row>
                <Row> <div className="col-md-12">
                    <Link to="/home">
                        <Button bsStyle="info" fill type="submit">
                            Back
                        </Button>
                    </Link>
                </div>
                </Row>
            </Grid>
        </div>)
    }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ViewPenipu));
