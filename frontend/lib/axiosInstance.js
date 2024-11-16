import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api', // Set your API base URL
  timeout: 10000, // Set a timeout for requests
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Add any custom headers or token here
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;