import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { showAlert } from '@/app/alerts';
import { API_URL } from '../url';
import { ApiErrorResponse } from '../ApiErrorResponse';

export interface UpdateOrderPayload {
    id: string;
}

export async function changeToProcessing(payload: UpdateOrderPayload) {
    try {
        const token = Cookies.get('token');
        const response = await axios.patch(`${API_URL}/orders/admin/update-to-processing`, payload, {
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
                showAlert(errorData.error || 'Невалидные данные заказа', 'error');
            } else if (status === 403) {
                showAlert(errorData.error || 'Недостаточно прав', 'error');
            } else if (status === 404) {
                showAlert(errorData.error || 'Заказ с таким ID не найден', 'error');
            } else if (status === 500) {
                showAlert(errorData.error || 'Внутренняя ошибка сервера', 'error');
            } else {
                showAlert(errorData.message || errorData.error || 'Произошла ошибка при обновлении заказа', 'error');
            }
        } else if (axiosError.request) {
            showAlert('Сервер не отвечает. Проверьте интернет-соединение', 'error');
        } else {
            showAlert('Ошибка при отправке запроса', 'error');
        }

        throw error;
    }
}

export async function changeToOnRent(payload: UpdateOrderPayload) {
    try {
        const token = Cookies.get('token');
        const response = await axios.patch(`${API_URL}/orders/admin/update-to-on-rent`, payload, {
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
                showAlert(errorData.error || 'Невалидные данные заказа', 'error');
            } else if (status === 403) {
                showAlert(errorData.error || 'Недостаточно прав', 'error');
            } else if (status === 404) {
                showAlert(errorData.error || 'Заказ с таким ID не найден', 'error');
            } else if (status === 500) {
                showAlert(errorData.error || 'Внутренняя ошибка сервера', 'error');
            } else {
                showAlert(errorData.message || errorData.error || 'Произошла ошибка при обновлении заказа', 'error');
            }
        } else if (axiosError.request) {
            showAlert('Сервер не отвечает. Проверьте интернет-соединение', 'error');
        } else {
            showAlert('Ошибка при отправке запроса', 'error');
        }

        throw error;
    }
}

export async function changeToExpired(payload: UpdateOrderPayload) {
    try {
        const token = Cookies.get('token');
        const response = await axios.patch(`${API_URL}/orders/admin/update-to-expired`, payload, {
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
                showAlert(errorData.error || 'Невалидные данные заказа', 'error');
            } else if (status === 403) {
                showAlert(errorData.error || 'Недостаточно прав', 'error');
            } else if (status === 404) {
                showAlert(errorData.error || 'Заказ с таким ID не найден', 'error');
            } else if (status === 500) {
                showAlert(errorData.error || 'Внутренняя ошибка сервера', 'error');
            } else {
                showAlert(errorData.message || errorData.error || 'Произошла ошибка при обновлении заказа', 'error');
            }
        } else if (axiosError.request) {
            showAlert('Сервер не отвечает. Проверьте интернет-соединение', 'error');
        } else {
            showAlert('Ошибка при отправке запроса', 'error');
        }

        throw error;
    }
}

export async function changeToDelivery(payload: UpdateOrderPayload) {
    try {
        const token = Cookies.get('token');
        const response = await axios.patch(`${API_URL}/orders/admin/update-to-delivery`, payload, {
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
                showAlert(errorData.error || 'Невалидные данные заказа', 'error');
            } else if (status === 403) {
                showAlert(errorData.error || 'Недостаточно прав', 'error');
            } else if (status === 404) {
                showAlert(errorData.error || 'Заказ с таким ID не найден', 'error');
            } else if (status === 500) {
                showAlert(errorData.error || 'Внутренняя ошибка сервера', 'error');
            } else {
                showAlert(errorData.message || errorData.error || 'Произошла ошибка при обновлении заказа', 'error');
            }
        } else if (axiosError.request) {
            showAlert('Сервер не отвечает. Проверьте интернет-соединение', 'error');
        } else {
            showAlert('Ошибка при отправке запроса', 'error');
        }

        throw error;
    }
}

export async function changeToCompleted(payload: UpdateOrderPayload) {
    try {
        const token = Cookies.get('token');
        const response = await axios.patch(`${API_URL}/orders/admin/update-to-completed`, payload, {
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
                showAlert(errorData.error || 'Невалидные данные заказа', 'error');
            } else if (status === 403) {
                showAlert(errorData.error || 'Недостаточно прав', 'error');
            } else if (status === 404) {
                showAlert(errorData.error || 'Заказ с таким ID не найден', 'error');
            } else if (status === 500) {
                showAlert(errorData.error || 'Внутренняя ошибка сервера', 'error');
            } else {
                showAlert(errorData.message || errorData.error || 'Произошла ошибка при обновлении заказа', 'error');
            }
        } else if (axiosError.request) {
            showAlert('Сервер не отвечает. Проверьте интернет-соединение', 'error');
        } else {
            showAlert('Ошибка при отправке запроса', 'error');
        }

        throw error;
    }
}

export async function changeToCancelled(payload: UpdateOrderPayload) {
    try {
        const token = Cookies.get('token');
        const response = await axios.patch(`${API_URL}/orders/admin/update-to-cancelled`, payload, {
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
                showAlert(errorData.error || 'Невалидные данные заказа', 'error');
            } else if (status === 403) {
                showAlert(errorData.error || 'Недостаточно прав', 'error');
            } else if (status === 404) {
                showAlert(errorData.error || 'Заказ с таким ID не найден', 'error');
            } else if (status === 500) {
                showAlert(errorData.error || 'Внутренняя ошибка сервера', 'error');
            } else {
                showAlert(errorData.message || errorData.error || 'Произошла ошибка при обновлении заказа', 'error');
            }
        } else if (axiosError.request) {
            showAlert('Сервер не отвечает. Проверьте интернет-соединение', 'error');
        } else {
            showAlert('Ошибка при отправке запроса', 'error');
        }

        throw error;
    }
}