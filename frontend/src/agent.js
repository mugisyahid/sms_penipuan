/* eslint-disable */
import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = process.env.REACT_APP_SERVER
const API_LOGIN = process.env.REACT_APP_LOGIN_SERVER

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
    superagent.post(`${API_ROOT}${url}`).type('form').send({
      json: json
    }).send({
      form: form
    }).use(tokenPlugin).then(responseBody)
};

const Auth = {
  current: () =>
    requests.get('/user'),
  login: (username, password) =>
    superagent.post(`${API_LOGIN}/auth/login`, {
      username: username,
      password: password
    }).use(tokenPlugin).then(responseBody),
  register: (username, email, password) =>
    requests.post('/users', {
      user: {
        username,
        email,
        password
      }
    }),
  save: user =>
    requests.put('/user', {
      user
    })
};


const Sms = {
  getPenipu: (f, t) => requests.get('/penipu?f=' + f + '&t=' + t),
  countPenipu: () => requests.get('/penipu/count'),
  getReferencePenipu: (msisdn) => requests.get('/reference?msisdn=' + msisdn),
  getDetailSMS: (msisdn) => requests.get('/sms/v2?msisdn=' + msisdn),
  insertDetail: (payload) => requests.post('/insert_detail', payload),
  updateReference: (payload) => requests.post('/reference', {
    payload
  }),
  getDetail: (payload) => requests.post('/get_detail', {
    payload
  }),
}

export default {
  Auth,
  Sms,
  setToken: _token => {
    token = _token;
  }
};