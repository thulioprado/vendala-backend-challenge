import axios from 'axios';
import { loadProgressBar } from 'axios-progress-bar';
import { getToken } from './auth';
import 'axios-progress-bar/dist/nprogress.css';

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

loadProgressBar({
  showSpinner: false
}, api);

export default api;