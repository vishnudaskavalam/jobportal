import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000',
});

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await API.post('/auth/login', data);

  return response.data;
};