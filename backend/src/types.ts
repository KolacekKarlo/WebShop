export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  featured: boolean;
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface OrderData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  items: CartItem[];
  totalPrice: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
