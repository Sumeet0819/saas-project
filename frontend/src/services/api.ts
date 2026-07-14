import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

let storeInstance: any = null;

export const injectStore = (store: any) => {
  storeInstance = store;
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach the auth token
api.interceptors.request.use(
  (config) => {
    if (storeInstance) {
      // Get token from Redux store dynamically
      const state = storeInstance.getState();
      const token = state.auth?.token;

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);




// Response interceptor to handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., dispatch logout, or redirect)
      // store.dispatch(logout());
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
