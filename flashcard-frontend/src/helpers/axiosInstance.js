import axios from 'axios';

export const axiosServer = axios.create({
  baseURL: 'http://localhost:8080'
});

export const axiosServerAuth = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
});
