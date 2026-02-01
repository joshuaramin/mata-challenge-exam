import BasicArgs from "./basicArgs";

export interface CreateCustomerData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}
export interface CustomerArgs extends BasicArgs {}
