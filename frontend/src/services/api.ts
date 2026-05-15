import { Product, ApiResponse, OrderFormData, CartItem } from '../types';

const API_BASE_URL = '/api';

interface OrderPayload {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  items: { productId: number; quantity: number }[];
  totalPrice: number;
}

export const api = {
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error('Greška pri dohvaćanju proizvoda');
    }
    const data: ApiResponse<Product[]> = await response.json();
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Greška pri dohvaćanju proizvoda');
    }
    return data.data;
  },

  async getProductById(id: number): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Greška pri dohvaćanju proizvoda');
    }
    const data: ApiResponse<Product> = await response.json();
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Proizvod nije pronađen');
    }
    return data.data;
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
    if (!response.ok) {
      throw new Error('Greška pri filtriranju proizvoda');
    }
    const data: ApiResponse<Product[]> = await response.json();
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Greška pri filtriranju proizvoda');
    }
    return data.data;
  },

  async getCategories(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Greška pri dohvaćanju kategorija');
    }
    const data: ApiResponse<string[]> = await response.json();
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Greška pri dohvaćanju kategorija');
    }
    return data.data;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/featured`);
    if (!response.ok) {
      throw new Error('Greška pri dohvaćanju izdvojenih proizvoda');
    }
    const data: ApiResponse<Product[]> = await response.json();
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Greška pri dohvaćanju izdvojenih proizvoda');
    }
    return data.data;
  },

  async createOrder(formData: OrderFormData, cart: CartItem[]): Promise<string> {
    const orderPayload: OrderPayload = {
      ...formData,
      items: cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      })),
      totalPrice: cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    };

    const response = await fetch(`${API_BASE_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderPayload)
    });

    if (!response.ok) {
      throw new Error('Greška pri obradi narudžbe');
    }

    const data: ApiResponse<{ orderId: string }> = await response.json();
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Greška pri obradi narudžbe');
    }

    return data.data.orderId;
  }
};
