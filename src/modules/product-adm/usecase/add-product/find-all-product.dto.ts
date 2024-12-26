export interface FindAllProductInputDto {}

export interface FindAllProductOutputDto {
  id: string;
  name: string;
  description: string;
  purchasePrice: number;
  salesPrice: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
