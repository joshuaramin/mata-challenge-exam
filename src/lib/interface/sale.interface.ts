export interface CreateSaleData {
  product_id: string;
  quantity: number;
}

export interface CreateSaleInput {
  customer_id: string;
  items: CreateSaleData[];
}

export interface GetSalesByMonthInput {
  month: string;
}
