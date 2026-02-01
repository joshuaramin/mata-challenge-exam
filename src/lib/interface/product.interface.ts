import BasicArgs from "./basicArgs";

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  quantity: number;
}

export interface ProductArgs extends BasicArgs {}
