/* eslint-disable */
import React, { Component } from "react";
import { Grid, Row, Col, Table } from "react-bootstrap";
import { connect } from 'react-redux';
import agent from '../../agent';
import moment from 'moment';
import { Link, Redirect, withRouter } from 'react-router-dom';

import Card from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";

import {
    VIEW_DETAIL_SMS_PAGE_UNLOADED,
    GET_DETAIL_SMS_BY_MSISDN
} from '../../constants/actionTypes';
111
const mapStateToProps = state => ({ ...state, sms: state.sms });
const mapDispatchToProps = dispatch => ({
    onLoad: (payload) =>
        dispatch({ type: GET_DETAIL_SMS_BY_MSISDN, payload }),
    onUnload: () =>
        dispatch({ type: VIEW_DETAIL_SMS_PAGE_UNLOADED })
});

class ViewPenipu extends Component {

    componentWillMount() {
        this.props.onLoad(Promise.all([agent.Sms.getDetailSMS(this.props.location.pathname.replace('/view/penipu/', ''))]))
    }
    componentWillUnmount() {
        this.props.onUnload();
    }
    render() {
        if (!this.props.sms.detail) {
            return null;
        }

        const smsTable = ["Id", "target", "pelapor", "content", "date", "uploader", "source"]

        let arraySms = []
        this.props.sms.detail.forEach((u, idx) => {
            let arr = []
            arr[0] = u.id
            arr[1] = u.msisdn_target
            arr[2] = u.msisdn_pelapor
            arr[3] = u.content
            arr[4] = moment(u.date_system).format('hh:mm, DD MMM YYYY')
            arr[5] = u.uploader
            arr[6] = u.source
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
