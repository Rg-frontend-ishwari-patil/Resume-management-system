// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://resume-backend-1rnz.onrender.com/api/v1'
});

export default API;