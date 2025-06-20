import axios, { AxiosError } from 'axios';
import { showAlert } from '@/app/alerts';
import { API_URL } from './url';
import { ApiErrorResponse } from './ApiErrorResponse';

interface SignupResponse {
  token: string;
}

export async function signupUser(data: { username: string, password: string, firstName: string, lastName: string, birthDate: string, telNumber: string, mail: string }) {
  try {
    const response = await axios.post<SignupResponse>(`${API_URL}/auth/signup`, data);
    return response.data;
    } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    
    if (axiosError.response) {
      // Ошибка с ответом от сервера (4xx, 5xx)
      const errorData = axiosError.response.data;
      
      if (errorData.details?.length) {
        // Обработка ошибок валидации
        errorData.details.forEach(detail => {
          showAlert(detail, 'error');
        });
      } else {
        // Обработка других ошибок
        showAlert(
          errorData.message || errorData.error || 'Произошла ошибка при регистрации',
          'error'
        );
      }
    } else if (axiosError.request) {
      // Запрос был сделан, но ответ не получен
      showAlert('Сервер не отвечает. Проверьте интернет-соединение', 'error');
    } else {
      // Ошибка при настройке запроса
      showAlert('Ошибка при отправке запроса', 'error');
    }
    
    throw error; // Пробрасываем ошибку для дальнейшей обработки
  }
}

