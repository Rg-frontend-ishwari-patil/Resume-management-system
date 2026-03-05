// src/services/api.js
import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_URL || 'https://resume-backend-1rnz.onrender.com/api/v1').replace(/\/+$/, '');

const API = axios.create({
  baseURL
});

export default API;