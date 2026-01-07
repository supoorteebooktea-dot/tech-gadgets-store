export interface Product {
  id: number;
  name: string;
  description: string;
  price: string | number;
  originalPrice?: string | number;
  imageUrl?: string;
  category?: string;
  stock: number;
  featured?: boolean;
  rating?: string | number;
  reviews?: number;
}

export interface Order {
  id: number;
  userId: number;
  status: string;
  total: string | number;
  createdAt: string;
}

export interface Address {
  id: number;
  userId: number;
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zipCode: string;
}
