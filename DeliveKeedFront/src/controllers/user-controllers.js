import { BASE_API } from '../resources/api';
import axios from 'axios';

// Add the interceptor to attach the token to each request
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Registrar um novo usuário
async function registerUser({
    address,
    name,
    email,
    password1,
    password2,
    cpf,
    date_of_birth,
    numberContact,
}) {
  try {
    const response = await axios.post(`${BASE_API}/auth/registerUser`, {
        address,
        name,
        email,
        password1,
        password2,
        cpf,
        date_of_birth,
        numberContact,
    });
    console.log('Usuario Registrado!:', response.data);
    return response;
  } catch (error) {
    console.log('Erro ao registrar usuário:', error.response?.data || error.message);
    throw error;
  }
}

// Fazer login do usuário
async function loginUser(email, password) {
  try {
    console.log('email:', email);
    const response = await axios.post(`${BASE_API}/auth/login`, {
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    console.log('Logged in successfully:', response.data);
    return response;
  } catch (error) {
    console.log('Erro ao fazer login:', error.response?.data || error.message);
    throw error;
  }
}

async function logoutUser() {
  localStorage.removeItem('authToken');
  // Optionally, you can redirect the user to the login page
}

async function getUserInfo() {
  try {
    const response = await axios.get(`${BASE_API}/auth/userInfo`);
    console.log('User Info:', response.data);
    return response.data;
  } catch (error) {
    console.log('Erro ao obter informações do usuário:', error.response?.data || error.message);
    throw error;
  }
}

export { registerUser, loginUser, logoutUser, getUserInfo };
