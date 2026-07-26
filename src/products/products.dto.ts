export class CreateProductDto {
  title: string;
  description: any;
  price: number;
  percentage?: number;
  tab?: string;
  gradientSelect?: string;
  gradient?: string[];
  chegirmaSelect?: string;
  chegirma?: string;
  options: any;
  images?: string[];
  quantity: number;
  shop: string;
}