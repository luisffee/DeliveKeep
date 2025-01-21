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
      localStorage.setItem('userInfo', response.data.user_name);
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

async function getUserInfo(info) {
  try {
    const response = await axios.get(`${BASE_API}/auth/userInfo`, {
      params: { info }
    });
    console.log('User Info:', response.data);
    return response.data;
  } catch (error) {
    console.log('Erro ao obter informações do usuário:', error.response?.data || error.message);
    throw error;
  }
}

async function getProfile() {
  try {
    const response = await axios.get(`${BASE_API}/profile/getProfile`);
    console.log('User Info:', response.data);
    return response.data;
  } catch (error) {
    console.log('Erro ao obter informações do usuário:', error.response?.data || error.message);
    throw error;
  }
}

async function editProfile(data) {
  try {
    const response = await axios.put(`${BASE_API}/profile/editProfile`, data);
    console.log('User updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.log('Erro ao atualizar usuário:', error.response?.data || error.message);
    throw error;
  }
}

async function addAdress(data) {
  try {
    const response = await axios.post(`${BASE_API}/profile/addAdress`, data);
    console.log('Adress added successfully:', response.data);
    return response;
  } catch (error) {
    console.log('Erro ao adicionar endereço:', error.response?.data || error.message);
    throw error;
  }
}

async function deleteAdress(data) {
  try {
    const response = await axios.post(`${BASE_API}/profile/deleteAdress`, data);
    console.log('Adress deleted successfully:', response.data);
    return response;
  } catch (error) {
    console.log('Erro ao deletar endereço:', error.response?.data || error.message);
    throw error;
  }
}

async function addPayment(data) {
  try {
    const response = await axios.post(`${BASE_API}/profile/addPayment`, data);
    console.log('Payment added successfully:', response.data);
    return response;
  } catch (error) {
    console.log('Erro ao adicionar pagamento:', error.response?.data || error.message);
    throw error;
  }
}

async function deletePayment(data) {
  try {
    const response = await axios.delete(`${BASE_API}/profile/deletePayment`, data);
    console.log('Payment deleted successfully:', response.data);
    return response;
  } catch (error) {
    console.log('Erro ao deletar pagamento:', error.response?.data || error.message);
    throw error;
  }
}

export { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getUserInfo, 
  editProfile, 
  getProfile, 
  addAdress, 
  deleteAdress, 
  addPayment, 
  deletePayment 
};
