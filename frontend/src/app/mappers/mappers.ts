import { GetUserOrdersResponse, BooksInOrderResponse } from '@/app/api/orders/getUserOrders';
import { MappedOrder } from './mappedOrder';

export function mapOrderResponse(order: GetUserOrdersResponse): MappedOrder {
  return {
    id: order.id,
    customer: {
      fullName: `${order.firstName} ${order.lastName}`,
      username: order.username,
      email: order.mail,
      phone: order.telNumber,
      address: order.address,
    },
    books: order.books.map(book => ({
      id: book.bookId,
      title: book.title,
      author: book.author,
      quantity: parseInt(book.quantity),
      pricePerUnit: parseFloat(book.pricePerUnit),
      totalPrice: parseInt(book.quantity) * parseFloat(book.pricePerUnit),
    })),
    payment: {
      type: order.paymentType,
      typeText: order.paymentType === 'POSTPAY' ? 'При получении' : 'Предоплата',
      total: parseFloat(order.price),
    },
    status: {
      code: order.status,
      text: getStatusText(order.status),
    },
    dates: {
      createdAt: formatDate(order.createdAt),
      deliveryDate: formatDateShort(order.deliveryDate),
      expirationDate: formatDateShort(order.expirationDate),
    },
  };
}

function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    NEW: 'Новый',
    PROCESSING: 'В обработке',
    DELIVERY: 'Передан в доставку',
    ON_RENT: 'На прочтении',
    COMPLETED: 'Завершён',
    EXPIRED: 'Аренда просрочена',
    CANCELLED: 'Отменён',
  };
  return statusMap[status] || status;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('ru-RU');
}

function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}.${month}.${year}`;
}