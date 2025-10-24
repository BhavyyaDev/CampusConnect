import axios from 'axios';

const api = axios.create({
  baseURL: 'https://campusconnect-5jrx.onrender.com/api', 
});

export default api;