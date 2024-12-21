export interface PlaceOrderInputFacadeDto {
  clientId: string;
  products: {
    productId: string;
  }[];
}


export interface PlaceOrderOutputFacadeDto {
  id: string;
  invoiceId: string;
  status: string;
  total: number;
  products: {
    productId: string;
  }[];  
}

export default interface PlaceOrderUseCaseInterface {
  execute(input: PlaceOrderInputFacadeDto): Promise<PlaceOrderOutputFacadeDto>;
}