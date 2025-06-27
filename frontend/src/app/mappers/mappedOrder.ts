export interface MappedOrder {
  id: string;
  customer: {
    fullName: string;
    username: string,
    email: string;
    phone: string;
    address: string;
  };
  books: {
    id: string;
    title: string;
    author: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
  }[];
  payment: {
    type: string;
    typeText: string;
    total: number;
  };
  status: {
    code: string;
    text: string;
  };
  dates: {
    createdAt: string;
    deliveryDate: string;
    expirationDate: string;
  };
}