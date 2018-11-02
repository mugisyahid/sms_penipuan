/* eslint-disable */
import React, { Component } from "react";
import {
    Grid,
    Row,
    Col,
    FormGroup,
    ControlLabel,
    FormControl,
    HelpBlock,
    Table,
    Checkbox
} from "react-bootstrap";
import Card from "../../components/Card/Card.jsx";

import Button from "../../components/CustomButton/CustomButton.jsx";
import moment from 'moment';

import agent from '../../agent';
import { connect } from 'react-redux';
import { Link, Redirect, withRouter } from 'react-router-dom';

import {
    INSERT_TICKET_PAGE_UNLOADED,
    UPDATE_FIELD_TICKET,
    INSERT_TICKET_LOADED,
    UPDATE_DOCUMENT_TICKET,
    REMOVE_ALL_UPLOADED_DOCUMENTS,
    INSERT_TICKET,
    REMOVE_SINGLE_DOCS,
    EXCEED_UPLOAD_QUOTA
} from '../../constants/actionTypes';

const mapStateToProps = state => ({ ...state, redirect: state.ticket.redirect, reportType: state.ticket.reportType, reportConsumer: state.ticket.reportConsumer });
const mapDispatchToProps = dispatch => ({
    onLoad: (payload) =>
        dispatch({ type: INSERT_TICKET_LOADED, payload }),
    onUnload: () =>
        dispatch({ type: INSERT_TICKET_PAGE_UNLOADED }),
    onUpdateField: (key, value) =>
        dispatch({ type: UPDATE_FIELD_TICKET, key, value }),
    onUpdateDocument: (files) => {
        dispatch({ type: UPDATE_DOCUMENT_TICKET, files })
    },
    onClickUploadButton: () => {
        dispatch({ type: REMOVE_ALL_UPLOADED_DOCUMENTS })
    },
    onExceedUpload: (payload) => {
        dispatch({ type: EXCEED_UPLOAD_QUOTA, payload })
    },
    onRemoveFile: (payload) =>
        dispatch({ type: REMOVE_SINGLE_DOCS, payload }),
    onSubmit: (id, document, createdDate, projectTitle, selectedprojectName, selectedreportType, reportConsumser, expectedFulfillment, description, category, status, url, bussinessObjective, conditionLogic, outputFormat) => {
        let t = {
            creatorId: id,
            document: document,
            dateCreated: createdDate,
            projectTitle: projectTitle,
            projectName: selectedprojectName,
            selectedreportType: selectedreportType,
            selectedreportConsumser: reportConsumser,
            expectedFulfillment: expectedFulfillment,
            description: description,
            category: category,
            status: status,
            url: url,
            bussinessObjective: bussinessObjective,
            conditionLogic: conditionLogic,
            outputFormat: outputFormat
        }

        const payload = agent.Ticket.insertTicket(t);
        dispatch({ type: INSERT_TICKET, payload })
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


Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
}

class NewTicket extends Component {

    constructor() {
        super()
        const updateFieldEvent = key => ev => this.props.onUpdateField(key, ev.target.value);
        this.changeReportCategory = updateFieldEvent('reportCategory')
        this.changeProjectTitle = updateFieldEvent('projectTitle')
        this.changeProjectName = updateFieldEvent('projectName')
        this.changeReportType = updateFieldEvent('selectedreportType')
        this.changeReportConsumer = updateFieldEvent('selectedreportConsumser')
        this.changeExpectedFulfillment = updateFieldEvent('expectedFulfillment')
        this.changeBussinessObjective = updateFieldEvent('bussinessObjective')
        this.changeDescription = updateFieldEvent('description')
        this.changeConditionLogic = updateFieldEvent('conditionLogic')
        this.changeURL = updateFieldEvent('URL')

        // this.renderFileList = function (fileList) {
        //     let fileListDisplay = document.getElementById('file-list-display')
        //     fileListDisplay.innerHTML = '';
        //     fileList.forEach(function (file, index) {
        //         var fileDisplayEl = document.createElement('p');
        //         fileDisplayEl.innerHTML = (index + 1) + ': ' + file.name;
        //         fileListDisplay.appendChild(fileDisplayEl);
        //     });
        // }

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
            if (ev.target.files && ev.target.files.length > 0) {
                // this.props.onClickUploadButton()
            }
            for (var i = 0; i < ev.target.files.length; i++) {
                this.readFiles(ev.target.files[i], function (result) {
                    filePayload.push(result)
                })
            }
        }
        this.submitForm = (files, projectTitle, selectedprojectName, selectedreportType, reportConsumser, expectedFulfillment, description, reportCategory, url, bussinessObjective, conditionLogic, outputFormat) => ev => {
            ev.preventDefault();
            this.props.onSubmit(JSON.parse(window.localStorage.getItem('user')).ID, files, moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), projectTitle, selectedprojectName,
                selectedreportType, reportConsumser, expectedFulfillment, description,
                reportCategory, 'Created', url, bussinessObjective, conditionLogic, outputFormat);
        }
    }


    removeFile = (files, filename) => {
        // update state
        let array = []
        let i = 0
        files.forEach((file, idx) => {
            if (file.fileName !== filename) {
                array[i] = file
                i++
            }
        })
        // state change
        this.props.onRemoveFile(array)
    }

    checkboxEvent = (param, existingValue, isChecked, value) => {
        let arr = existingValue.split(',')
        if (isChecked) {
            arr.push(value)
        } else {
            // remove
            arr.remove(value)
        }
        if (arr[0] === "") {
            arr.splice(0, 1)
        }
        let payload = arr.join()
        this.props.onUpdateField(param, payload)
    }

    componentWillMount() {
        this.props.onLoad(Promise.all([agent.Ticket.getReportType(), agent.Ticket.getReportConsumer()]))
    }
    componentWillUnmount() {
        this.props.onUnload();
    }
    render() {

        const u = window.localStorage.getItem('user')
        if (u === 'undefined' || !u) {
            return <Redirect to='/login' />;
        }
        const user = JSON.parse(u)
        if (user.PRIVILEGES_ROLES !== 'Creator') {
            return <Redirect to={'/home'} />;
        }
        if (this.props.redirect) {
            return <Redirect to={this.props.redirect} />;
        }
        if (!this.props.reportType) {
            return null;
        }

        const projectTitle = this.props.ticket.projectTitle
        const selectedprojectName = this.props.ticket.projectName
        const selectedreportType = this.props.ticket.selectedreportType ? this.props.ticket.selectedreportType : ''
        const reportConsumser = this.props.ticket.selectedreportConsumser ? this.props.ticket.selectedreportConsumser : ''
        const selectedOutput = this.props.ticket.selectedOutput ? this.props.ticket.selectedOutput : ''
        const expectedFulfillment = this.props.ticket.expectedFulfillment
        const description = this.props.ticket.description
        const bussinessObjective = this.props.ticket.bussinessObjective
        const reportCategory = this.props.ticket.reportCategory ? this.props.ticket.reportCategory : 'New'
        const url = this.props.ticket.URL ? this.props.ticket.URL : ''
        const conditionLogic = this.props.ticket.conditionLogic
        // file
        const files = this.props.ticket.files

        let arrayReportType = []
        this.props.reportType.forEach((type, idx) => {
            let arr = []
            arr[0] = type.ID
            arr[1] = type.REPORT_TYPE_NAME
            arrayReportType[idx] = arr
        })
        let arrayReportConsumer = []
        this.props.reportConsumer.forEach((type, idx) => {
            let arr = []
            arr[0] = type.ID
            arr[1] = type.REPORT_CONSUMER_NAME
            arrayReportConsumer[idx] = arr
        })
        let arrayDocs = []
        let size = 0
        files.forEach((file, idx) => {
            let arr = []
            arr[0] = file.fileData
            arr[1] = file.fileName
            arr[2] = file.fileSize / 1000000
            size += file.fileSize
            arrayDocs[idx] = arr
        })

        let uploadWarning = ''
        let isDisabled = false
        if (size >= 26000001) {
            uploadWarning = "You can\'t upload docs more than 20 mb in total"
            isDisabled = true
        } else {
            uploadWarning = ''
            isDisabled = false
        }

        let outputFormatTemplate = ['Pdf', 'Excel', 'Txt', 'csv', 'ccis']
        let outputFormat = []
        outputFormatTemplate.forEach((v, idx) => {
            let arr = []
            arr[0] = v
            outputFormat[idx] = arr
        })


        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={8}>
                            <Card
                                title="New Ticket"
                                content={
                                    <form onSubmit={this.submitForm(files, projectTitle, selectedprojectName, selectedreportType, reportConsumser, expectedFulfillment, description, reportCategory, url, bussinessObjective, conditionLogic, selectedOutput)}>
                                        <Row>
                                            <Col md={3}>
                                                <FormGroup>
                                                    <ControlLabel>Report Category</ControlLabel>
                                                    <FormControl componentClass="select" value={this.props.reportCategory} onChange={this.changeReportCategory} >
                                                        <option value={'New'} key={'NewReportCategory'}>New</option>
                                                        <option value={'Modification'} key={'ModificationReportCategory'}>Modification</option>
                                                    </FormControl>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={4}>
                                                <FormGroup controlId="formControlsProjectTitle">
                                                    <ControlLabel>Project Title</ControlLabel>
                                                    <FormControl
                                                        type="text"
                                                        value={this.props.projectTitle}
                                                        onChange={this.changeProjectTitle}
                                                        placeholder="Project Title"
                                                        autoComplete="off"
                                                    />
                                                    <FormControl.Feedback />
                                                    <HelpBlock>Title of the project</HelpBlock>
                                                </FormGroup>
                                            </Col>
                                            <Col md={4}>
                                                <FormGroup controlId="formControlsUploadFiles">
                                                    <ControlLabel>Project Name</ControlLabel>
                                                    <FormControl
                                                        type="text"
                                                        value={this.props.projectName}
                                                        onChange={this.changeProjectName}
                                                        placeholder="Project Name"
                                                        autoComplete="off"
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
                                                        return <Checkbox inline value={prop[1]} key={key} onClick={e => this.checkboxEvent('selectedreportType', selectedreportType, e.target.checked, prop[1])}>{prop[1]}</Checkbox>;
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
                                                        return <Checkbox inline key={key} onClick={e => this.checkboxEvent('selectedreportConsumser', reportConsumser, e.target.checked, prop[1])}>{prop[1]}</Checkbox>;
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
                                                        return <Checkbox inline key={key} onClick={e => this.checkboxEvent('selectedOutput', selectedOutput, e.target.checked, prop[0])}>{prop[0]}</Checkbox>;
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
                                        {uploadWarning !== '' ? <Row>
                                            <Col md={6}>
                                                <font color="red">{uploadWarning}</font>
                                            </Col>
                                        </Row> : ''}
                                        <Row>
                                            {/* <div id='file-list-display'></div> */}
                                            <Col md={6}>
                                                <Table striped hover>
                                                    <thead>
                                                        <tr>
                                                            <th>Uploaded Docs</th>
                                                            <th> Size (MB)</th>
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
                                                                    {prop[2]}
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
                                                        value={this.props.expectedFulfillment}
                                                        onChange={this.changeExpectedFulfillment}
                                                        min={`${moment().add(3, "days").format('YYYY-MM-DD')}`}
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
                                                        value={this.props.URL}
                                                        onChange={this.changeURL}
                                                        placeholder="url"
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Button bsStyle="info" pullRight fill type="submit" disabled={isDisabled}>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewTicket));
