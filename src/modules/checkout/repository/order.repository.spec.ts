import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import OrderModel from "./order.model";
import { migrator } from "../../../migrations/migrator";
import OrderRepository from "./order.repository";
import Order from "../domain/order.entity";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import ClientModel from "../../client-adm/repository/client.model";
import ProductModel from "../../product-adm/repository/product.model";
import OrderItemModel from "./order.item.model";

describe("Order repository test", () => {
  let sequelize: Sequelize
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    })

    sequelize.addModels([ClientModel, ProductModel, OrderItemModel, OrderModel])
    migration = migrator(sequelize, false)
    await migration.up()
  })

  afterEach(async () => {
    if (!migration || !sequelize) {
      return 
    }    
    migration = migrator(sequelize, false)
    await migration.down()    
    await sequelize.drop()
    await sequelize.close()    
  })

  it("should create a order", async () => {
    const orderRepository = new OrderRepository()

    const client = new Client({
      id: new Id("1"),
      name: "Maria",
      email: "maria@gmail.com",
      address: "Rua teste"
    })

    await ClientModel.create({
      id: 1,
      name: "Maria",
      email: "maria@gmail.com",
      document: "123456",
      street: "Rua teste",
      number: 35,
      complement: "",
      city: "Contagem",
      state: "MG",
      zipcode: "32.000-000",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const products = [
      new Product({
          id: new Id("1"),
          name: "Produto 1",
          description: "Produto 1",
          salesPrice: 15,
      }),
      new Product({
          id: new Id("2"),
          name: "Produto 2",
          description: "Produto dois",
          salesPrice: 37.5,
      }),
    ]

    const order = new Order({
      id: new Id("1"),
      client: client,
      products: products,
      status: "pending",
    })
    
    await orderRepository.addOrder(order)

    const orderDb = (await OrderModel.findOne({ where: { id: "1" } })).dataValues    
    expect(orderDb).toBeDefined()
    expect(orderDb.id).toEqual(order.id.id)
    
  })
})