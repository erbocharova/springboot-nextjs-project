// Файл для взаимодействия с бэком
// Сюда добавляем функции, в качестве адреса запроса в таком виде: API_URL/адрес-роута-на-бэке. Адрес роута не бэке это тот, который находится
// в строке  @GetMapping("/адрес") в контроллере ShopController.kt

import axios, { AxiosError } from 'axios';
import { showAlert } from '@/app/alerts';
import { API_URL } from './url';
import { ApiErrorResponse } from './ApiErrorResponse';

interface LoginResponse {
  token: string;
}

export async function loginUser(data: { username: string, password: string }) {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/auth/signin`, data);
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
          errorData.message || errorData.error || 'Произошла ошибка при входе',
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

