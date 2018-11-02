/* eslint-disable */
import React, { Component } from "react";
import { Grid, Row, Col, FormGroup, FormControl, ControlLabel, Table } from "react-bootstrap";
import { connect } from 'react-redux';
import agent from '../../agent';
import moment from 'moment';
import { Link, Redirect, withRouter } from 'react-router-dom';

import Card from "../../components/Card/Card.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";

import {
    VIEW_TICKET_PAGE_UNLOADED,
    UPDATE_FIELD_TICKET,
    EXECUTOR_REJECT_TICKET,
    EXECUTOR_APPROVE_TICKET,
    EXECUTOR_FINISH_TICKET,
    UPDATE_DOCUMENT_EXECUTOR_TICKET,
    REMOVE_SINGLE_DOCS_EXECUTOR,
    EXECUTOR_PAGE_LOADED
} from '../../constants/actionTypes';

const mapStateToProps = state => ({
    ...state,
    redirect: state.ticket.redirect,
    ticket: state.ticket.ticket,
    description: state.ticket.description,
    newURL: state.ticket.newURL,
    submit: state.ticket.submit,
    files: state.ticket.files
})

const mapDispatchToProps = dispatch => ({
    onLoad: (payload) =>
        dispatch({ type: EXECUTOR_PAGE_LOADED, payload }),
    onUnload: () =>
        dispatch({ type: VIEW_TICKET_PAGE_UNLOADED }),
    onReject: (id, rejectorId, rejectNotes) => {
        const param = {
            ticketId: id,
            rejectorId: rejectorId,
            rejectNotes: rejectNotes
        }
        const payload = agent.Ticket.executorRejectTicket(param)
        dispatch({ type: EXECUTOR_REJECT_TICKET, payload })
    },
    onApprove: (id, approverId, approveNotes) => {
        const param = {
            ticketId: id,
            approverId: approverId,
            approveNotes: approveNotes
        }
        const payload = agent.Ticket.acceptTicket(param)
        dispatch({ type: EXECUTOR_APPROVE_TICKET, payload })
    },
    onFinish: (id, approverId, approveNotes, newURL, documents) => {
        let d = []
        console.log(documents)
        documents.forEach((dd, idx) => {
            if (dd.FILENAME) {
                // CLEAN 
                let f = {
                    'fileData': dd.FILEDATA,
                    'fileName': dd.FILENAME,
                    'fileSize': dd.FILESIZE,
                    'lastModified': dd.LASTMODIFIED,
                    'fileType': dd.FILETYPE,
                    'docType': dd.DOCUMENT_TYPES
                }
                d[idx] = f
            } else {
                dd.docType = 'RESULT'
                d[idx] = dd
            }
        })
        const param = {
            ticketId: id,
            approverId: approverId,
            approveNotes: approveNotes,
            newURL: newURL,
            document: d
        }
        const payload = agent.Ticket.finishTicket(param)
        dispatch({ type: EXECUTOR_FINISH_TICKET, payload })
    },
    onUpdateField: (key, value) =>
        dispatch({ type: UPDATE_FIELD_TICKET, key, value }),
    onUpdateDocument: (files) => {
        dispatch({ type: UPDATE_DOCUMENT_EXECUTOR_TICKET, files })
    }, onRemoveFile: (payload) =>
        dispatch({ type: REMOVE_SINGLE_DOCS_EXECUTOR, payload })

})


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

class ExecuteTicket extends Component {
    constructor() {
        super()
        const updateFieldEvent = key => ev => this.props.onUpdateField(key, ev.target.value);
        this.changeDescription = updateFieldEvent('description')
        this.changeURL = updateFieldEvent('newURL')
        this.submit = (submit, ticketId, userId, description, newURL, files) => ev => {
            ev.preventDefault()
            if (submit === 'approve') {
                this.props.onApprove(ticketId, userId, description)
            } else if (submit === 'reject') {
                this.props.onReject(ticketId, userId, description)
            } else {
                this.props.onFinish(ticketId, userId, description, newURL, files)
            }
        }
        this.clicked = (val) => ev => {
            this.props.onUpdateField('submit', val)
        }
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
    }


    removeFile = (files, filename) => {
        // update state
        let array = []
        let i = 0
        files.forEach((file, idx) => {
            let name = file.FILENAME ? file.FILENAME : file.fileName
            if (name !== filename) {
                array[i] = file
                i++
            }
        })
        // state change
        this.props.onRemoveFile(array)
    }

    componentWillMount() {
        this.props.onLoad(Promise.all([agent.Ticket.getTicketById(this.props.location.pathname.replace('/executeTicket/', ''))]))
    }
    componentWillUnmount() {
        this.props.onUnload();
    }
    render() {
        if (!this.props.ticket) {
            return null;
        }
        if (this.props.redirect) {
            return <Redirect to={this.props.redirect} />;
        }

        const user = JSON.parse(window.localStorage.getItem('user'))
        if (!user) {
            return <Redirect to='/login' />;
        }
        const userId = user.ID
        const ticketId = this.props.ticket[0][0].ID
        const description = this.props.description
        const newURL = this.props.newURL ? this.props.newURL : this.props.ticket[0][0].EXECUTOR_URL
        // file
        const files = this.props.files

        let idx = 0
        let arrayDocs = []
        let idx2 = 0
        let arrayDocsUpload = []
        files.forEach((docs, i) => {
            if (docs.DOCUMENT_TYPES === 'NODIN') {
                let arr = []
                arr[0] = docs.FILEDATA ? docs.FILEDATA : docs.fileData
                arr[1] = docs.FILENAME ? docs.FILENAME : docs.fileName
                arrayDocs[idx++] = arr
            } else {
                let arr = []
                arr[0] = docs.FILEDATA ? docs.FILEDATA : docs.fileData
                arr[1] = docs.FILENAME ? docs.FILENAME : docs.fileName
                arrayDocsUpload[idx2++] = arr
            }
        })

        return (<div className="content">
            <Grid fluid>
                <Row>
                    <Col md={12}>
                        <Card
                            title={`Ticket #${this.props.ticket[0][0].TICKET_ID}`}
                            category={`Created by ${this.props.ticket[0][0].NAME} at ${moment(this.props.ticket[0][0].DATE_CREATED).format('hh:mm, DD MMM YYYY')}`}
                            content={
                                <form onSubmit={this.submit(this.props.submit, ticketId, userId, description, newURL, files)}>
                                    <div>
                                        <div className="typo-line">
                                            <p>
                                                <span className="category">Report Category</span>{`${this.props.ticket[0][0].REPORT_CATEGORY}`}
                                            </p>
                                        </div>
                                        <div className="typo-line">
                                            <p>
                                                <span className="category">Project Title</span>{`${this.props.ticket[0][0].REPORT_TITLE}`}
                                            </p>
                                        </div>
                                        <div className="typo-line">
                                            <p>
                                                <span className="category">Project Name</span>{`${this.props.ticket[0][0].REPORT_NAME}`}
                                            </p>
                                        </div>
                                        <div className="typo-line">
                                            <p>
                                                <span className="category">Uploaded Docs</span>
                                                {arrayDocs.map((prop, key) => {
                                                    return <p><a href={prop[0]} download={prop[1]} key={key}>{prop[1]}</a></p>
                                                })}

                                            </p>
                                        </div>
                                        <div className="typo-line">
                                            <p>
                                                <span className="category">Report Types</span>{`${this.props.ticket[0][0].REPORT_TYPE_ID}`}
                                            </p>
                                        </div>
                                        <div className="typo-line">
                                            <p>
                                                <span className="category">Report Consumer</span>{`${this.props.ticket[0][0].REPORT_CONSUMER_ID}`}
                                            </p>
                                        </div>
                                        {this.props.ticket[0][0].OUTPUT_FORMAT ? <div className="typo-line">
                                            <p>
                                                <span className="category">Output Format</span>{`${this.props.ticket[0][0].OUTPUT_FORMAT}`}
                                            </p>
                                        </div>
                                            : ''}
                                        <div className="typo-line">
                                            <p>
                                                <span className="category">Expected fulfillment</span>{`${moment(this.props.ticket[0][0].EXPECTED_REPORT_FULFILLMENT).format('DD MMM YYYY')}`}
                                            </p>
                                        </div>

                                        <div className="typo-line">
                                            <p>
                                                <span className="category">Description</span>{`${this.props.ticket[0][0].REPORT_DESCRIPTION}`}
                                            </p>
                                        </div>
                                        <div className="typo-line">
                                            <p>
                                                <span className="category">Business Objective</span>{`${this.props.ticket[0][0].BUSINESS_OBJECTIVES}`}
                                            </p>
                                        </div>
                                        {this.props.ticket[0][0].URL ? <div className="typo-line">
                                            <p>
                                                <span className="category">creator URL</span>
                                                {`${this.props.ticket[0][0].URL}`.indexOf('http') >= 0 ?
                                                    <a href={`${this.props.ticket[0][0].URL}`}>{`${this.props.ticket[0][0].URL}`}</a> :
                                                    <a href={`http://${this.props.ticket[0][0].URL}`}>{`${this.props.ticket[0][0].URL}`}</a>}
                                            </p>
                                        </div> : ''}
                                        {this.props.ticket[0][0].APPROVER_REJECT_NOTES && this.props.ticket[0][0].STATUS === 'In Progress' ?
                                            <div className="typo-line">
                                                <p>
                                                    <span className="category">Reject Notes by <br />Approver</span>{`${this.props.ticket[0][0].APPROVER_REJECT_NOTES}`}
                                                </p>
                                            </div> : ''}
                                        {this.props.ticket[0][0].STATUS === 'In Progress' ? <div className="typo-line">
                                            <span className="category">Update URL</span>
                                            <FormGroup controlId="formGroupDescription">
                                                <FormControl
                                                    type="text"
                                                    placeholder="update url"
                                                    defaultValue={this.props.ticket[0][0].EXECUTOR_URL}
                                                    value={this.props.newURL}
                                                    onChange={this.changeURL}
                                                />
                                            </FormGroup>
                                        </div> : ''}
                                        {/* In progress */}
                                        {this.props.ticket[0][0].STATUS === 'In Progress' ? <div className="typo-line">
                                            <span className="category">Upload Result</span>
                                            <FormGroup controlId="formControlsUploadFiles">
                                                <FormControl
                                                    type="file"
                                                    multiple
                                                    onChange={this.changeDocs}
                                                    style={{ color: 'transparent' }}
                                                />
                                            </FormGroup>
                                        </div> : ''}
                                        {this.props.ticket[0][0].STATUS === 'In Progress' ? <div className="typo-line">
                                            <Table striped hover>
                                                <thead>
                                                    <tr>
                                                        <th>Uploaded Docs</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {arrayDocsUpload.map((prop, key) => {
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
                                        </div> : ''}

                                        {this.props.ticket[0][0].STATUS === 'Approved' ?
                                            <div>
                                                <div className="typo-line">
                                                    <p>
                                                        <span className="category">Approved At</span>{`${moment(this.props.ticket[0][0].DATE_APPROVED).format('hh:mm, DD MMM YYYY')}`}
                                                    </p>
                                                </div>
                                                <div className="typo-line">
                                                    <p>
                                                        <span className="category">Approved Notes</span>{`${this.props.ticket[0][0].APPROVER_NOTES}`}
                                                    </p>
                                                </div>
                                            </div> : ''}
                                        <div className="typo-line">
                                            <span className="category">Notes</span>
                                            <FormGroup controlId="formGroupDescription">
                                                <FormControl
                                                    rows="5"
                                                    componentClass="textarea"
                                                    bsClass="form-control"
                                                    placeholder="Notes"
                                                    value={this.props.description}
                                                    onChange={this.changeDescription}
                                                />
                                            </FormGroup>
                                        </div>
                                        <div className="typo-line">
                                            <span className="category">Action</span>

                                            <span style={{ marginRight: 10 + 'px' }}>
                                                {this.props.ticket[0][0].STATUS === 'Approved' ? <Button bsStyle="info" type="submit" fill onClick={this.clicked('approve')}>
                                                    Accept
                                                </Button> : <Button bsStyle="info" type="submit" fill onClick={this.clicked('finish')}>
                                                        Finish
                                                </Button>}

                                            </span>
                                            <span>
                                            </span>
                                        </div>
                                    </div>
                                </form>
                            }
                        />
                    </Col>
                </Row>

                <Row>
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

        </div>);
    }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ExecuteTicket));
