import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://job-application-tracker-2mm8.onrender.com',
});

export default api;
