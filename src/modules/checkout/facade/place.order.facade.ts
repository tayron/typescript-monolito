import PlaceOrderUseCaseInterface, { PlaceOrderInputFacadeDto, PlaceOrderOutputFacadeDto } from "./place.order.facade.interface";

export class PlaceOrderFacade implements PlaceOrderUseCaseInterface {
  private _placeOrder: PlaceOrderUseCaseInterface;

  constructor(usecase: PlaceOrderUseCaseInterface) {
    this._placeOrder = usecase;
  }

  async execute(input: PlaceOrderInputFacadeDto): Promise<PlaceOrderOutputFacadeDto> {
    return this._placeOrder.execute(input);
  }
}