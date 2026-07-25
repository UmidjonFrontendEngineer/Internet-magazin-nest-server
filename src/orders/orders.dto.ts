export class CreateOrderDto {
  userId: string;
  items: any;
  totalPrice: number;
  status?: string;
  address?: string;
  phone?: string;
}