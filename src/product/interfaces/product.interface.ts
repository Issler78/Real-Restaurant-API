export interface IProduct {
  id: number;
  name: string;
  description: string|null;
  price: number;
  categoryId: number;
  available: boolean;
}
