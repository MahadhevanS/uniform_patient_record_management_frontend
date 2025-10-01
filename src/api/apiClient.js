import axios from 'axios';

// Define the base URL for your FastAPI backend
const API_URL = 'http://localhost:8000/api/v1'; 

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor to attach the JWT token to every request header.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve token from local storage
    const token = localStorage.getItem('access_token');
    
    if (token) {
      // Ensure the token is prefixed with 'Bearer '
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;