import axios, { AxiosError } from 'axios';
import { showAlert } from '@/app/alerts';
import { API_URL } from './url';

export interface CreateOrderRequest {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    telNumber: string;
    address: string;
    paymentType: string;
    deliveryDate: string;
}

export interface CreateOrderResponse {
    orderId: string;
}

export interface ApiErrorResponse {
    error: string;
    message?: string;
}

export async function createOrder(data: CreateOrderRequest, token: string): Promise<CreateOrderResponse> {
    try {
        const response = await axios.post<CreateOrderResponse>(`${API_URL}/orders/new`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;

        if (axiosError.response) {
            const errorData = axiosError.response.data;
            showAlert(
                errorData.message || errorData.error || 'Произошла ошибка при создании заказа',
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
