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
  product: Product;
  quantity: number;
}

export interface OrderFormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
