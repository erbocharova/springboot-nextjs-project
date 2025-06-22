import axios, { AxiosError } from 'axios';
import { showAlert } from '@/app/alerts';
import { API_URL } from '../url';
import { ApiErrorResponse } from '../ApiErrorResponse';

export async function getBookById(token: string, id: string) {
  try {
    const response = await axios.get(`${API_URL}/books/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response) {
      const errorData = axiosError.response.data;
      showAlert(
        errorData.message || errorData.error || `Ошибка получения книги с ID ${id}`,
        'error'
      );
    } else if (axiosError.request) {
      showAlert('Сервер не отвечает. Проверьте интернет-соединение', 'error');
    } else {
      showAlert('Ошибка при отправке запроса', 'error');
    }

    throw error;
  }
}
