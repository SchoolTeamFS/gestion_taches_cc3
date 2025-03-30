import axios from 'axios';

const proApi = axios.create({
  baseURL: 'http://localhost:5001/projet',  
  headers: {
    'Content-Type': 'application/json',
  }
});

export default proApi;
