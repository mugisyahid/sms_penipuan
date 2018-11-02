/* eslint-disable */
import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = process.env.NODE_ENV === 'production' ? 'http://localhost:4000' : 'http://localhost:4000';

const encode = encodeURIComponent;
const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `Bearer ${token}`);
  }
}

const requests = {
  del: url =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  update: (url, body) =>
    superagent.patch(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  postForm: (url, form, json) =>
    superagent.post(`${API_ROOT}${url}`).type('form').send({ json: json }).send({ form: form }).use(tokenPlugin).then(responseBody)
};

const Auth = {
  current: () =>
    requests.get('/user'),
  login: (username, password) =>
    requests.post('/auth/login', { username: username, password: password }),
  register: (username, email, password) =>
    requests.post('/users', { user: { username, email, password } }),
  save: user =>
    requests.put('/user', { user })
};

const Ticket = {
  getTicket: () => requests.get('/ticket'),
  getTicketByUserId: (id) => requests.get('/ticket/user/' + id),
  getTicketById: (id) => requests.get('/ticket/' + id),
  getTicketByStatus: (id, status) => requests.post('/ticket', {
    approverId: id,
    getTiket: true,
    status: status
  }),
  getTicketByStatusExecutor: (id, status) => requests.post('/ticket/executor/get', {
    getTiket: true,
    status: status,
    executorId: id
  }),
  deleteTicketById: (id) => requests.del('/ticket/' + id),
  countTicket: (id, status) => requests.get('/ticket/status/' + status + '/' + id),
  countTicketAdmin: (id, status) => requests.get('/ticket/admin/' + status + '/' + id),
  countTicketApprover: (id, status) => requests.get('/ticket/approver/' + status + '/' + id),
  countTicketExecutor: (id, status) => requests.get('/ticket/executor/' + status + '/' + id),
  countAll: () => requests.get('/ticket/count/All'),
  insertTicket: (params) => requests.post('/ticket', params),
  updateTicket: (params) => requests.update('/ticket', params),
  rejectTicket: (params) => { requests.post('/ticket/reject', params) },
  approveTicket: (params) => { requests.post('/ticket/approve', params) },
  doneTicket: (params) => { requests.post('/ticket/done', params) },
  executorRejectTicket: (params) => { requests.post('/ticket/execute/reject', params) },
  acceptTicket: (params) => { requests.post('/ticket/execute/accept', params) },
  finishTicket: (params) => { requests.post('/ticket/execute/finish', params) },
  getReportType: () => requests.get('/ticket/reportType'),
  getReportConsumer: () => requests.get('/ticket/reportConsumer')
}

const User = {
  getUser: () => requests.get('/user'),
  getUserById: (id) => requests.get('/user/' + id),
  getUserByRoles: (roles) => requests.get('/user/roles/' + roles),
  deleteUserById: (id) => requests.del('/user/' + id),
  insertUser: (status, createdDate, username, email, name, password, roles, department, division) => requests.post('/user', {
    status: status,
    createdDate: createdDate,
    userId: username,
    username: username,
    name: name,
    password: password,
    privilegesRoles: roles,
    contactEmail: email,
    department: department,
    division: division
  }),
  updateUser: (id, params) => requests.update('/user/' + id, params)
}

const Notif = {
  getNotif: (id, roles) => requests.get('/notif/' + roles + '/' + id),
  getDate: () => requests.get('/notif'),
  viewUpdate: (params) => requests.update('/notif/view', params), 
}

export default {
  Auth,
  Ticket,
  User,
  Notif,
  setToken: _token => { token = _token; }
};
