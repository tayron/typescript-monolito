import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import PlaceOrderGateway from "../gateway/place.order.gateway";
import OrderModel from "./order.model";

export default class OrderRepository implements PlaceOrderGateway {
  async addOrder(order: Order): Promise<void> {
    try {
      await OrderModel.create({
        id: order.id.id,
        client: order.client,
        clientId: order.client.id.id,
        items: order.products,
        total: order.total,
        status: order.status,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    } catch (erro) {
      throw new Error(`Error on add order: ${erro}`);
    }

  }

  async findOrder(id: string): Promise<Order | null> {
    const order = await OrderModel.findOne({
      where: { id },
    });

    if (!order) {
      throw new Error(`Product with id ${id} not found`);
    }    


    const client = new Client({
      name: order.client.name, 
      email: order.client.email, 
      address: `${order.client.street, order.client.number, order.client.complement, order.client.city, order.client.state, order.client.zipcode}`
    })

    const products = order.items.map((product) => {
      return new Product({
        id: new Id(product.id),
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      })
    })

    return new Order({
      id: new Id(order.id),
      client: client,
      products: products,
    });
  }
  
}

