import request from "supertest"
import express, { Express } from 'express'
import { Sequelize } from 'sequelize-typescript';
import { Umzug } from 'umzug';
import bodyParser from 'body-parser';
import { migrator } from '../../migrations/migrator';
import ClientAdmFacadeFactory from '../../modules/client-adm/factory/client-adm.facade.factory';
import router from '../router';
import ClientModel from "../../modules/client-adm/repository/client.model";
import Address from "../../modules/@shared/domain/value-object/address";
import ProductAdmFacadeFactory from "../../modules/product-adm/factory/facade.factory";
import ProductModel from "../../modules/product-adm/repository/product.model";
import OrderModel from "../../modules/checkout/repository/order.model";
import OrderItemModel from "../../modules/checkout/repository/order.item.model";


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
    await sequelize.close()
  })  

  it("should create order with successfully", async () => {
    const clientData = {
      name: "Lucian",
      email: "lucian@xpto.com",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa verde",
        "Criciúma",
        "SC",
        "88888-888",
      )
    };

    const clientAdmFacade = ClientAdmFacadeFactory.create();
    await clientAdmFacade.add(clientData);
    
    const clientsDb = await clientAdmFacade.findAll()
    expect(clientsDb).toBeDefined();
    expect(clientsDb.length).toBe(1);

    const productData = {
      name: "Produto A",
      description: "Descrição produto A",
      purchasePrice: 15.50,
      salesPrice: 20.00,      
      stock: 5,
    };   

    const productAdmFacade = ProductAdmFacadeFactory.create();
    await productAdmFacade.addProduct(productData);    

    const productsDb = await productAdmFacade.findAllProducts()
    expect(productsDb).toBeDefined();
    expect(productsDb.length).toBe(1);    

    const output = await request(app)
      .post("/api/v1/checkout")
      .send({
        "clientId": clientsDb[0].id,
        "products": [{"productId": productsDb[0].id}]
    })

    console.log(output.body)

    expect(output.status).toBe(201)
    expect(output.body).toBeDefined()
  }) 
})