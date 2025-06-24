import axios, { AxiosError } from 'axios';
import { showAlert } from '@/app/alerts';
import { API_URL } from './url';
import { ApiErrorResponse } from './ApiErrorResponse';

export interface GetProfileResponse {
    username: string;
    firstName: string;
    lastName: string
    birthDate: string;
    telNumber: string;
    mail: string;
    role: string;
}

export async function getProfile(data: string) {
    try {
        const response = await axios.get<GetProfileResponse>(`${API_URL}/my-profile`, {
            headers: { Authorization: `Bearer ${data}` },
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;

        if (axiosError.response) {
            // Ошибка с ответом от сервера (4xx, 5xx)
            const errorData = axiosError.response.data;
            showAlert(
                errorData.message || errorData.error || 'Произошла ошибка при загрузке профиля',
                'error'
            );
        } else if (axiosError.request) {
            // Запрос был сделан, но ответ не получен
            showAlert('Сервер не отвечает. Проверьте интернет-соединение', 'error');
        } else {
            showAlert('Ошибка при отправке запроса', 'error');
        }

        throw error;
    }
}

