/* eslint-disable */
import React, { Component } from "react";
import {
    Grid,
    Row,
    Col,
    FormGroup,
    ControlLabel,
    FormControl,
    Checkbox,
    Table
} from "react-bootstrap";
import Card from "../../components/Card/Card.jsx";

import Button from "../../components/CustomButton/CustomButton.jsx";
import moment from 'moment';

import agent from '../../agent';
import { connect } from 'react-redux';
import { Link, Redirect, withRouter } from 'react-router-dom';

import {
    UPDATE_TICKET_LOADED,
    UPDATE_TICKET_PAGE_UNLOADED,
    UPDATE_FIELD_TICKET,
    UPDATE_DOCUMENT_TICKET,
    REMOVE_ALL_UPLOADED_DOCUMENTS,
    UPDATE_TICKET,
    REMOVE_SINGLE_DOCS
} from '../../constants/actionTypes';

const mapStateToProps = state => ({ ...state, oldTicket: state.ticket.oldTicket, files: state.ticket.files, redirect: state.ticket.redirect, reportType: state.ticket.reportType, reportConsumer: state.ticket.reportConsumer });
const mapDispatchToProps = dispatch => ({
    onLoad: (payload) =>
        dispatch({ type: UPDATE_TICKET_LOADED, payload }),
    onUnload: () =>
        dispatch({ type: UPDATE_TICKET_PAGE_UNLOADED }),
    onUpdateField: (key, value) =>
        dispatch({ type: UPDATE_FIELD_TICKET, key, value }),
    onUpdateDocument: (files) => {
        dispatch({ type: UPDATE_DOCUMENT_TICKET, files })
    },
    onClickUploadButton: () => {
        dispatch({ type: REMOVE_ALL_UPLOADED_DOCUMENTS })
    },
    onRemoveFile: (payload) =>
        dispatch({ type: REMOVE_SINGLE_DOCS, payload }),
    onSubmit: (ticketId, id, document, createdDate, projectTitle, selectedprojectName, selectedreportType, reportConsumser, expectedFulfillment, description, url, bussinessObjective, conditionLogic, outputFormat) => {
        // HERE CLEAN UP THE DOCS
        let d = []
        document.forEach((dd, idx) => {
            if (dd.FILENAME) {
                // CLEAN 
                let f = {
                    'fileData': dd.FILEDATA,
                    'fileName': dd.FILENAME,
                    'fileSize': dd.FILESIZE,
                    'lastModified': dd.LASTMODIFIED,
                    'fileType': dd.FILETYPE
                }
                d[idx] = f
            } else {
                d[idx] = dd
            }
        })
        let params = {
            id: ticketId,
            creatorId: id,
            document: d,
            dateCreated: createdDate,
            projectTitle: projectTitle,
            projectName: selectedprojectName,
            selectedreportType: selectedreportType,
            selectedreportConsumser: reportConsumser,
            expectedFulfillment: expectedFulfillment,
            description: description,
            url: url,
            bussinessObjective: bussinessObjective,
            conditionLogic: conditionLogic,
            outputFormat: outputFormat
        }
        const payload = agent.Ticket.updateTicket(params);
        dispatch({ type: UPDATE_TICKET, payload })
    }
});


const readBase64 = file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    })
}

class UpdateTicket extends Component {

    constructor() {
        super()
        const updateFieldEvent = key => ev => this.props.onUpdateField(key, ev.target.value);
        this.changeProjectTitle = updateFieldEvent('projectTitle')
        this.changeProjectName = updateFieldEvent('projectName')
        this.changeReportType = updateFieldEvent('selectedreportType')
        this.changeReportConsumer = updateFieldEvent('selectedreportConsumser')
        this.changeExpectedFulfillment = updateFieldEvent('expectedFulfillment')
        this.changeBussinessObjective = updateFieldEvent('bussinessObjective')
        this.changeDescription = updateFieldEvent('description')
        this.changeConditionLogic = updateFieldEvent('conditionLogic')
        this.changeURL = updateFieldEvent('URL')

        this.readFiles = (file, next) => {
            readBase64(file).then(data => {
                let f = {
                    'fileData': data,
                    'fileName': file.name,
                    'fileSize': file.size,
                    'lastModified': file.lastModified,
                    'fileType': file.type
                }
                this.props.onUpdateDocument(f)
                next(f)
            })
        }
        this.changeDocs = ev => {
            let filePayload = []
            let fileList = []
            for (var i = 0; i < ev.target.files.length; i++) {
                fileList.push(ev.target.files[i]);
                this.readFiles(ev.target.files[i], function (result) {
                    filePayload.push(result)
                })
            }
        }
        this.submitForm = (ticketId, files, projectTitle, selectedprojectName, selectedreportType, reportConsumser, expectedFulfillment, description, url, bussinessObjective, conditionLogic, outputFormat) => ev => {
            ev.preventDefault();
            this.props.onSubmit(ticketId, JSON.parse(window.localStorage.getItem('user')).ID, files, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), projectTitle, selectedprojectName, selectedreportType, reportConsumser, moment(expectedFulfillment).format('YYYY-MM-DD HH:mm:ss'), description, url, bussinessObjective, conditionLogic, outputFormat);
        }
    }

    componentWillMount() {
        this.props.onLoad(Promise.all([
            agent.Ticket.getTicketById(this.props.location.pathname.replace('/updateTicket/', '')),
            agent.Ticket.getReportType(),
            agent.Ticket.getReportConsumer()
        ]))
    }
    componentWillUnmount() {
        this.props.onUnload();
    }

    removeFile = (files, filename) => {
        let array = []
        let i = 0
        files.forEach((file, idx) => {
            const fileName = file.fileName ? file.fileName : file.FILENAME
            if (fileName !== filename) {
                array[i] = file
                i++
            }
        })
        this.props.onRemoveFile(array)
    }


    checkboxEvent = (param, existingValue, isChecked, value) => {
        let arr = existingValue.split(',')
        if (isChecked && !arr.includes(value)) {
            arr.push(value)
        } else if (!isChecked) {
            arr.remove(value)
        }
        if (arr[0] === "") {
            arr.splice(0, 1)
        }
        let payload = arr.join()
        this.props.onUpdateField(param, payload)
    }

    render() {
        if (!this.props.oldTicket) {
            return null;
        }
        if (this.props.redirect) {
            return <Redirect to={this.props.redirect} />;
        }


        const ID = this.props.oldTicket[0].ID
        const projectTitle = this.props.ticket.projectTitle ? this.props.ticket.projectTitle : this.props.oldTicket[0].REPORT_TITLE
        const selectedprojectName = this.props.ticket.projectName ? this.props.ticket.projectName : this.props.oldTicket[0].REPORT_NAME
        const selectedreportType = this.props.ticket.selectedreportType ? this.props.ticket.selectedreportType : this.props.oldTicket[0].REPORT_TYPE_ID
        const reportConsumser = this.props.ticket.selectedreportConsumser ? this.props.ticket.selectedreportConsumser : this.props.oldTicket[0].REPORT_CONSUMER_ID
        const selectedOutput = this.props.ticket.selectedOutput ? this.props.ticket.selectedOutput : this.props.oldTicket[0].OUTPUT_FORMAT
        const expectedFulfillment = this.props.ticket.expectedFulfillment ? this.props.ticket.expectedFulfillment : this.props.oldTicket[0].EXPECTED_REPORT_FULFILLMENT
        const description = this.props.ticket.description ? this.props.ticket.description : this.props.oldTicket[0].REPORT_DESCRIPTION
        const bussinessObjective = this.props.ticket.bussinessObjective ? this.props.ticket.bussinessObjective : this.props.oldTicket[0].BUSINESS_OBJECTIVES
        const url = this.props.ticket.URL ? this.props.ticket.URL : this.props.oldTicket[0].URL
        const conditionLogic = this.props.ticket.conditionLogic ? this.props.ticket.conditionLogic : this.props.oldTicket[0].CONDITION_LOGIC
        // file
        const files = this.props.ticket.files

        const arrReportConsumser = reportConsumser.split(',')
        const arrSelectedreportType = selectedreportType.split(',')
        const arrSelectedOutputFormat = selectedOutput.split(',')

        let outputFormatTemplate = ['Pdf', 'Excel', 'Txt', 'csv', 'ccis']
        let outputFormat = []
        outputFormatTemplate.forEach((v, idx) => {
            let arr = []
            arr[0] = v
            arr[1] = v
            if (arrSelectedOutputFormat.includes(v)) {
                arr[2] = true
            } else {
                arr[2] = false
            }
            outputFormat[idx] = arr
        })

        let arrayReportType = []
        this.props.reportType.forEach((type, idx) => {
            let arr = []
            arr[0] = type.ID
            arr[1] = type.REPORT_TYPE_NAME
            if (arrSelectedreportType.includes(type.REPORT_TYPE_NAME)) {
                arr[2] = true
            } else {
                arr[2] = false
            }
            arrayReportType[idx] = arr
        })
        let arrayReportConsumer = []
        this.props.reportConsumer.forEach((type, idx) => {
            let arr = []
            arr[0] = type.ID
            arr[1] = type.REPORT_CONSUMER_NAME
            if (arrReportConsumser.includes(type.REPORT_CONSUMER_NAME)) {
                arr[2] = true
            } else {
                arr[2] = false
            }
            arrayReportConsumer[idx] = arr
        })

        let arrayDocs = []
        this.props.files.forEach((docs, idx) => {
            let arr = []
            arr[0] = docs.FILEDATA ? docs.FILEDATA : docs.fileData
            arr[1] = docs.FILENAME ? docs.FILENAME : docs.fileName
            arrayDocs[idx] = arr
        })
        // this.renderFileList(fileList)
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={8}>
                            <Card
                                title="Update Ticket"
                                content={
                                    <form onSubmit={this.submitForm(ID, files, projectTitle, selectedprojectName, selectedreportType, reportConsumser, expectedFulfillment, description, url, bussinessObjective, conditionLogic, selectedOutput)}>
                                        {this.props.oldTicket[0].STATUS === 'Rejected' ?
                                            <div>
                                                <div className="typo-line">
                                                    <p>
                                                        <span className="category">Rejected</span>Notes: {`${this.props.oldTicket[0].APPROVER_REJECT_NOTES}`}
                                                    </p>
                                                    <p>
                                                    <span className="category"></span>At: {`${moment(this.props.oldTicket[0].DATE_REJECTED).format('hh:mm, DD MMM YYYY')}`}
                                                    </p>
                                                </div>
                                            </div> : ''}
                                        <Row>
                                            <Col md={4}>
                                                <FormGroup controlId="formControlsUploadFiles">
                                                    <ControlLabel>Ticket ID</ControlLabel>
                                                    <FormControl
                                                        type="text"
                                                        defaultValue={this.props.oldTicket[0].TICKET_ID}
                                                        disabled="true"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4}>
                                                <FormGroup controlId="formControlsUploadFiles">
                                                    <ControlLabel>Project Title</ControlLabel>
                                                    <FormControl
                                                        type="text"
                                                        defaultValue={this.props.oldTicket[0].REPORT_TITLE}
                                                        value={this.props.projectTitle}
                                                        onChange={this.changeProjectTitle}
                                                        placeholder="Project Title"
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={4}>
                                                <FormGroup controlId="formControlsUploadFiles">
                                                    <ControlLabel>Project Name</ControlLabel>
                                                    <FormControl
                                                        type="text"
                                                        defaultValue={this.props.oldTicket[0].REPORT_NAME}
                                                        value={this.props.projectName}
                                                        onChange={this.changeProjectName}
                                                        placeholder="Project Name"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <FormGroup>
                                                    <ControlLabel>Report Type</ControlLabel>
                                                    <br />
                                                    {arrayReportType.map((prop, key) => {
                                                        return <Checkbox inline key={key} checked={prop[2]} onClick={e => this.checkboxEvent('selectedreportType', selectedreportType, e.target.checked, prop[1])}>{prop[1]}</Checkbox>;
                                                    })}
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <FormGroup>
                                                    <ControlLabel>Report Consumer</ControlLabel>
                                                    <br />
                                                    {arrayReportConsumer.map((prop, key) => {
                                                        return <Checkbox inline key={key} checked={prop[2]} onClick={e => this.checkboxEvent('selectedreportConsumser', reportConsumser, e.target.checked, prop[1])}>{prop[1]}</Checkbox>;
                                                    })}
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <FormGroup>
                                                    <ControlLabel>Output Format</ControlLabel>
                                                    <br />
                                                    {outputFormat.map((prop, key) => {
                                                        return <Checkbox inline key={key} checked={prop[2]} onClick={e => this.checkboxEvent('selectedOutput', selectedOutput, e.target.checked, prop[1])}>{prop[1]}</Checkbox>;
                                                    })}
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4}>
                                                <FormGroup controlId="formControlsUploadFiles">
                                                    <ControlLabel>Upload Document</ControlLabel>
                                                    <FormControl
                                                        type="file"
                                                        multiple
                                                        value={this.props.file}
                                                        onChange={this.changeDocs}
                                                        style={{ color: 'transparent' }}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            {/* <div id='file-list-display'></div> */}
                                            <Col md={6}>
                                                <Table striped hover>
                                                    <thead>
                                                        <tr>
                                                            <th>Uploaded Docs</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {arrayDocs.map((prop, key) => {
                                                            return (<tr key={key}>
                                                                <td>
                                                                    <a href={prop[0]} download={prop[1]} key={key}>{prop[1]}</a>
                                                                </td>
                                                                <td>
                                                                    <Button bsStyle='danger' onClick={() => this.removeFile(files, prop[1])}>Remove</Button>
                                                                </td>
                                                            </tr>)
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4}>
                                                <FormGroup controlId="formControlsUploadFiles">
                                                    <ControlLabel>Expected Fulfillment</ControlLabel>
                                                    <FormControl
                                                        type="date"
                                                        defaultValue={`${moment(this.props.oldTicket[0].EXPECTED_REPORT_FULFILLMENT).format('YYYY-MM-DD')}`}
                                                        value={this.props.expectedFulfillment}
                                                        onChange={this.changeExpectedFulfillment}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <FormGroup controlId="formGroupDescription">
                                                    <ControlLabel>Description</ControlLabel>
                                                    <FormControl
                                                        rows="5"
                                                        componentClass="textarea"
                                                        bsClass="form-control"
                                                        placeholder="Description of the Project"
                                                        defaultValue={this.props.oldTicket[0].REPORT_DESCRIPTION}
                                                        value={this.props.description}
                                                        onChange={this.changeDescription}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={12}>
                                                <FormGroup controlId="formGroupDescription">
                                                    <ControlLabel>Business Objectives</ControlLabel>
                                                    <FormControl
                                                        rows="5"
                                                        componentClass="textarea"
                                                        bsClass="form-control"
                                                        placeholder="Objectives for report "
                                                        defaultValue={this.props.oldTicket[0].BUSINESS_OBJECTIVES}
                                                        value={this.props.bussinessObjective}
                                                        onChange={this.changeBussinessObjective}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={12}>
                                                <FormGroup controlId="formGroupDescription">
                                                    <ControlLabel>Condition Logic</ControlLabel>
                                                    <FormControl
                                                        rows="5"
                                                        componentClass="textarea"
                                                        bsClass="form-control"
                                                        placeholder="Logic for Reports"
                                                        defaultValue={this.props.oldTicket[0].CONDITION_LOGIC}
                                                        value={this.props.conditionLogic}
                                                        onChange={this.changeConditionLogic}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup controlId="formControlsUploadFiles">
                                                    <ControlLabel>URL (if any)</ControlLabel>
                                                    <FormControl
                                                        type="text"
                                                        defaultValue={this.props.oldTicket[0].URL}
                                                        value={this.props.URL}
                                                        onChange={this.changeURL}
                                                        placeholder="url"
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
                        <Link to="/ticket">
                            <Button bsStyle="info" fill type="submit">
                                Back
                        </Button>
                        </Link>
                    </div>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UpdateTicket));