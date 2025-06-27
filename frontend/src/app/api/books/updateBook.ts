import axios, { AxiosError } from 'axios';
import { showAlert } from '@/app/alerts';
import { API_URL } from '../url';


export interface UpdateBookPayload {
    name?: string;
    author?: string;
    description?: string;
    imageUrl?: string;
    price?: number;
    quantity?: number;
    available?: boolean;
    popular?: boolean;
    category?: string;
}

export async function updateBook(id: string, payload: UpdateBookPayload) {
    try {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        const response = await axios.patch(`${API_URL}/books/admin/update/${id}`, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response) {
            const errorData = axiosError.response.data as { error?: string; message?: string };
            const status = axiosError.response.status;
            if (status === 400) {
                showAlert(errorData.error || 'Невалидные данные книги', 'error');
            } else if (status === 403) {
                showAlert(errorData.error || 'Недостаточно прав', 'error');
            } else if (status === 404) {
                showAlert(errorData.error || 'Книга с таким ID не найдена', 'error');
            } else if (status === 500) {
                showAlert(errorData.error || 'Внутренняя ошибка сервера', 'error');
            } else {
                showAlert(errorData.message || errorData.error || 'Произошла ошибка при обновлении книги', 'error');
            }
        } else if (axiosError.request) {
            showAlert('Сервер не отвечает. Проверьте интернет-соединение', 'error');
        } else {
            showAlert('Ошибка при отправке запроса', 'error');
        }

        throw error;
    }
}