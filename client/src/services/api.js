// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:7878/api/v1'
});

export default API;
