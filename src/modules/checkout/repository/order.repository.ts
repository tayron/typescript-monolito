import { getProducts } from "../../../api/handler/products.handler";
import Id from "../../@shared/domain/value-object/id.value-object";
import ProductModel from "../../@shared/model/product.model";
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

    const products = await this.getProdutsFromOrder(order)

    return new Order({
      id: new Id(order.id),
      client: client,
      products: products,
    });
  }

  async getProdutsFromOrder(order: OrderModel): Promise<Product[]> {
    const products = await Promise.all(order.items.map(async (product:any) => {
      const productDb = await ProductModel.findOne({
        where: { id: product.id.id }
      });

      if (!productDb) {
        throw new Error(`Product with id ${product.id.id} not found`);
      }

      return new Product({
        id: new Id(productDb.id),
        name: productDb.name,
        description: productDb.description,
        salesPrice: productDb.salesPrice,
      });
    }))

    return products;
  }
  
}

