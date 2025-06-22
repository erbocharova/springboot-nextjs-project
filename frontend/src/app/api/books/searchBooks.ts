import axios, { AxiosError } from 'axios';
import { API_URL } from '../url';
import { showAlert } from '@/app/alerts';
import { getAuthToken } from '@/app/hooks/useAuthToken';

export async function searchBooks(searchRequest: any) {
  try {
    const headers: Record<string, string> = {};
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axios.get(`${API_URL}/books/search`, {
      headers,
      params: searchRequest,
    });

    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      const errorData = axiosError.response.data as { message?: string; error?: string };
      showAlert(
        errorData.message || errorData.error || 'Ошибка поиска книг',
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
