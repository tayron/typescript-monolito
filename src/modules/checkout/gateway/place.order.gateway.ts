import Order from "../domain/order.entity";

export default interface PlaceOrderGateway {
  addOrder(order: Order): Promise<any>;
  findOrder(id: string): Promise<Order | null>;
}