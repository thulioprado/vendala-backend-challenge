import axios from 'axios';
import { loadProgressBar } from 'axios-progress-bar';
import { getToken, login } from './auth';
import 'axios-progress-bar/dist/nprogress.css';

let refreshToken     = false;
let refreshCallbacks = [];

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Vendala-Token': '$2y$10$PS6DX/hhjArL7KodDVy5QOMDb.Op99p2Vh.6CVlWlWSSv2OJmYE2q'
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
  console.log(error);
  const { config, response: { status } } = error;
  const requestConfig                    = config;

  if (status === 401) {
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
  } else {
    return Promise.reject(error);
  }
});

loadProgressBar({
  showSpinner: false
}, api);

export default api;