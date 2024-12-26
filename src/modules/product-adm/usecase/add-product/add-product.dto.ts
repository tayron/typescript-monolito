export interface AddProductInputDto {
  id?: string;
  name: string;
  description: string;
  salesPrice: number;
  purchasePrice: number;
  stock: number;
}

export interface AddProductOutputDto {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
  purchasePrice: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
