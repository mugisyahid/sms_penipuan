import React, { Component } from "react";
import {
    Grid, Row, Col,
    FormControl,
    FormGroup,
    ControlLabel
} from "react-bootstrap";
import { connect } from 'react-redux';
// import agent from '../../agent';
// import moment from 'moment';
import { Link, Redirect, withRouter } from 'react-router-dom';

import Card from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";

import {
    INSERT_DETAIL_SMS_PAGE_UNLOADED,
    INSERT_DETAIL_SMS_PAGE_LOADED,
    INSERT_DETAIL_SMS_UPDATE,
    INSERT_DETAIL_SMS
} from '../../constants/actionTypes';
import agent from "../../agent.js";


const mapStateToProps = state => ({ ...state, sms: state.sms });
const mapDispatchToProps = dispatch => ({
    onLoad: () =>
        dispatch({ type: INSERT_DETAIL_SMS_PAGE_LOADED }),
    onUnload: () =>
        dispatch({ type: INSERT_DETAIL_SMS_PAGE_UNLOADED }),
    onUpdateField: (key, value) =>
        dispatch({ type: INSERT_DETAIL_SMS_UPDATE, key, value }),
    onInsert: () =>
        dispatch({ type: INSERT_DETAIL_SMS }),

});

class NewPenipu extends Component {

    constructor() {
        super()
        const updateFieldEvent = key => ev => this.props.onUpdateField(key, ev.target.value)
        this.pelapor = updateFieldEvent('pelapor')
        this.target = updateFieldEvent('target')
        this.content = updateFieldEvent('content')

        this.submitForm = (target, pelapor, content) => ev => {
            ev.preventDefault()
            const param = {
                msisdn_target: target,
                msisdn_pelapor: pelapor,
                content: content,
                uploader: window.localStorage.getItem('user').substring(1, window.localStorage.getItem('user').length - 1),
                source: 'webapps'
            }
            // eslint-disable-next-line 
            const res = agent.Sms.insertDetail(param)
            // the result gonna be useful, maybe?
            this.props.onInsert()
        }

    }
    componentWillMount() {
        this.props.onLoad()
    }
    componentWillUnmount() {
        this.props.onUnload()
    }
    render() {


        if (this.props.sms.redirect) {
            return <Redirect to={this.props.sms.redirect} />;
        }

        const pelapor = this.props.sms.pelapor
        const target = this.props.sms.target
        const content = this.props.sms.content

        return (<div className="content">
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={8}>
                            <Card
                                title="Laporan Baru"
                                content={
                                    <form onSubmit={this.submitForm(target, pelapor, content)}>
                                        <Row>
                                            <Col md={4}>
                                                <FormGroup controlId="formControlsUploadFiles">
                                                    <ControlLabel>MSISDN Target</ControlLabel>
                                                    <FormControl
                                                        type="text"
                                                        value={this.props.sms.target}
                                                        onChange={this.target}
                                                        placeholder="target"
                                                        autoComplete="off"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={4}>
                                                <FormGroup controlId="formControlsUploadFiles">
                                                    <ControlLabel>MSISDN Pelapor</ControlLabel>
                                                    <FormControl
                                                        type="text"
                                                        value={this.props.sms.pelapor}
                                                        onChange={this.pelapor}
                                                        placeholder="pelapor"
                                                        autoComplete="off"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={8}>
                                                <FormGroup controlId="formControlsUploadFiles">
                                                    <ControlLabel>Content</ControlLabel>
                                                    <FormControl
                                                        componentClass="textarea"
                                                        value={this.props.sms.content}
                                                        onChange={this.content}
                                                        placeholder="content sms"
                                                        autoComplete="off"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Button bsStyle="info" pullRight fill type="submit">
                                            Submit
                                        </Button>
                                        <div className="clearfix" />
                                    </form>
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
            </div>
        </div>)
    }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewPenipu));
