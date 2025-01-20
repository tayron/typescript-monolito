import request from "supertest"
import express, { Express } from 'express'
import { Sequelize } from 'sequelize-typescript';
import { Umzug } from 'umzug';
import bodyParser from 'body-parser';
import { migrator } from '../../migrations/migrator';
import router from '../router';
import ClientModel from "../../modules/client-adm/repository/client.model";
import ProductModel from "../../modules/@shared/model/product.model";
import OrderModel from "../../modules/checkout/repository/order.model";
import OrderItemModel from "../../modules/checkout/repository/order.item.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";


describe("POST /checkout", () => {

  const app: Express = express()
  app.use(bodyParser.json());
  app.use('/api/v1', router);

  let sequelize: Sequelize
  let migration: Umzug<any>;  

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    })
    
    sequelize.addModels([ClientModel, ProductModel, OrderItemModel, OrderModel, TransactionModel])
    migration = migrator(sequelize, false)
    await migration.up()
  })

  afterEach(async () => {
    if (!migration || !sequelize) {
      return 
    }
    migration = migrator(sequelize, false)
    await migration.down()
    await sequelize.close()
  })  

  it("should create order with successfully", async () => {
    const outputClient = await request(app)
      .post("/api/v1/clients")
      .send({
        "name": "Lucian",
        "email": "lucian@xpto.com",
        "document": "1234-5678",      
        "street": "Rua 123",
        "number": "99",
        "complement": "Casa Verde",
        "city": "Criciúma",
        "state": "SC",
        "zipCode": "88888-888"
    })

    expect(outputClient.status).toBe(201)
    expect(outputClient.body.id).toBeDefined()

    const outputProduct = await request(app)
      .post("/api/v1/products")
      .send({
        "name": "Example Product",
        "description": "This is a description of the example product.",
        "price": 29.99,
        "stock": 100
    })    

    expect(outputProduct.status).toBe(201)
    expect(outputProduct.body.id).toBeDefined()

    const clientID = outputClient.body.id
    const productID = outputProduct.body.id

    const outputCheckout = await request(app)
      .post("/api/v1/checkout")
      .send({
        "clientId": clientID,
        "products": [{"productId": productID}]
    })

    expect(outputCheckout.status).toBe(201)
    expect(outputCheckout.body).toBeDefined()
  }) 
})