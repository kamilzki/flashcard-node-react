import axios from 'axios';

export const axiosServer = axios.create({
  baseURL: 'http://localhost:8080'
});
