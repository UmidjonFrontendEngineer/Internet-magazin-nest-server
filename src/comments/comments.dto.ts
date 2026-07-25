export class CreateCommentDto {
  productId: string;
  userId: string;
  text: string;
  rating?: number;
}