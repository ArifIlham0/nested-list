import axios from 'axios';

const api = axios.create({
  baseURL: 'https://v2.jokeapi.dev',
});

export default api;
