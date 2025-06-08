// Файл для взаимодействия с бэком
// Сюда добавляем функции, в качестве адреса запроса в таком виде: API_URL/адрес-роута-на-бэке. Адрес роута не бэке это тот, который находится
// в строке  @GetMapping("/адрес") в контроллере ShopController.kt

import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export async function loginUser(data: { username: string, password: string }) {
  return axios.post(`${API_URL}/auth/signin`, data);
}

export async function signupUser(data: { username: string, password: string, firstName: string, lastName: string, birthDate: string }) {
  return axios.post(`${API_URL}/auth/signup`, data);
}

export async function getProfile(data: string) {
  return axios.get(`${API_URL}/my-profile`, {
    headers: { Authorization: `Bearer ${data}` },
  });
}

export async function getUsers() {
  return axios.get(`${API_URL}/users`)
  
}