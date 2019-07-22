import axios from 'axios';
import { loadProgressBar } from 'axios-progress-bar';
import { isAuth, getToken, login } from './auth';
import 'axios-progress-bar/dist/nprogress.css';
import config from '../config.js';

let refreshToken     = false;
let refreshCallbacks = [];

const api = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Vendala-Token': config.VENDALA_TOKEN
  }
});

api.interceptors.request.use(async (config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {  
  if (error.response !== undefined) {
    const { config, response: { status } } = error;
    const requestConfig                    = config;

    if ((status === 498 || status === 401) && isAuth()) {
      if (!refreshToken) {
        refreshToken = true;

        api.get('/auth/refresh')
          .then((response) => {
            const { data } = response;

            login(data.token);

            refreshCallbacks.map((callback) => callback(data.token));
            
            refreshToken     = false;
            refreshCallbacks = [];
          });
      }

      const request = new Promise((resolve, reject) => {
        refreshCallbacks.push((token) => {
          requestConfig.headers['Authorization'] = 'Bearer ' + token;
          resolve(axios(requestConfig));
        });
      });

      return request;
    }
  }

  return Promise.reject(error);
});

loadProgressBar({
  showSpinner: false
}, api);

export default api;