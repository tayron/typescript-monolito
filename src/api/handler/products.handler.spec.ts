import productRoutes from '../router';
import request from "supertest"
import express, { Express } from 'express'
import { Sequelize } from 'sequelize-typescript';
import { Umzug } from 'umzug';
import bodyParser from 'body-parser';

import { migrator } from '../../migrations/migrator';
import ProductModel from '../../modules/@shared/model/product.model';
import ProductAdmFacadeFactory from '../../modules/product-adm/factory/facade.factory';


describe("POST /products", () => {

  const app: Express = express()
  app.use(bodyParser.json());
  app.use('/api/v1', productRoutes);

  let sequelize: Sequelize
  let migration: Umzug<any>;  

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    })
    
    sequelize.addModels([ProductModel])
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

  it("should create products with successfully", async () => {
    const output = await request(app)
      .post("/api/v1/products")
      .send({
        "name": "Example Product",
        "description": "This is a description of the example product.",
        "price": 29.99,
        "stock": 100
    })    

    expect(output.status).toBe(201)
    expect(output.body.id).toBeDefined()
    expect(output.body.name).toBe("Example Product")
    expect(output.body.description).toBe("This is a description of the example product.")
    expect(output.body.purchasePrice).toBe(29.99)
    expect(output.body.stock).toBe(100)
  })

  it("should get all products", async () => {
    const outputCreate = await request(app)
      .post("/api/v1/products")
      .send({
        "name": "Example Product",
        "description": "This is a description of the example product.",
        "price": 29.99,
        "stock": 100
    })

    expect(outputCreate.status).toBe(201)

    const outputGet = await request(app)
      .get("/api/v1/products")
      .send()

    expect(outputGet.status).toBe(200)
    expect(outputGet.body.length).toBe(1)
  })  

  it("should check stock", async () => {
    const outputCreateProducts = await request(app)
      .post("/api/v1/products")
      .send({
        "name": "Example Product",
        "description": "This is a description of the example product.",
        "price": 29.99,
        "stock": 100
    })

    expect(outputCreateProducts.status).toBe(201)

    const factory = ProductAdmFacadeFactory.create()
    const products = await factory.findAllProducts()

    expect(products.length).toBe(1)

    const outputGetStock = await request(app)
      .get(`/api/v1/products/${products[0].id}/stock`)
      .send()

    expect(outputGetStock.status).toBe(200)
    expect(outputGetStock.body.stock).toBe(100)

  })  
})