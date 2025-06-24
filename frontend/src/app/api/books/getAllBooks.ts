import axios, { AxiosError } from 'axios';
import { showAlert } from '@/app/alerts';
import { API_URL } from '../url';

export async function getAllBooks() {
  try {
    const response = await axios.get(`${API_URL}/books/all`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      const errorData = axiosError.response.data as { error?: string; message?: string };
      showAlert(errorData.message || errorData.error || 'Произошла ошибка при загрузке книг', 'error');
    } else if (axiosError.request) {
      showAlert('Сервер не отвечает. Проверьте интернет-соединение', 'error');
    } else {
      showAlert('Ошибка при отправке запроса', 'error');
    }

    throw error;
  }
}
