import axios, { AxiosError } from 'axios';
import { showAlert } from '@/app/alerts';
import { API_URL } from '../url';
import { ApiErrorResponse } from '../ApiErrorResponse';

export interface GetAllOrdersResponse {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    mail: string;
    telNumber: string;
    address: string;
    books: BooksInOrderResponse[];
    price: string;
    paymentType: string;
    status: string;
    createdAt: string;
    deliveryDate: string;
    expirationDate: string;
}

export interface BooksInOrderResponse {
    bookId: string;
    title: string;
    author: string;
    quantity: string;
    pricePerUnit: string;
}

export async function getAllOrders(data: string) {
    try {
        const response = await axios.get<GetAllOrdersResponse[]>(`${API_URL}/orders/admin/get-all`, {
            headers: { Authorization: `Bearer ${data}` },
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;

        if (axiosError.response) {
            const errorData = axiosError.response.data;
            showAlert(
                errorData.message || errorData.error || 'При загрузке ваших заказов произошла ошибка',
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