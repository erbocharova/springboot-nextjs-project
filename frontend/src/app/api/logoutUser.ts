import axios, { AxiosError } from 'axios';
import { showAlert } from '@/app/alerts';
import { API_URL } from './url';
import { ApiErrorResponse } from './ApiErrorResponse';

export async function logout() {
  try {
    await axios.post(`${API_URL}/my-profile/logout`, {}, {
      withCredentials: true // Передача cookies
    });

    alert('Вы успешно вышли из системы.');

    window.location.href = '/';
  } catch (error) {
    
  }
}