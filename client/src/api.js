import axios from 'axios';

// Create an instance of axios with the backend base URL
const api = axios.create({
  baseURL: 'http://localhost:5000',
});

// Request interceptor to automatically add JWT authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
