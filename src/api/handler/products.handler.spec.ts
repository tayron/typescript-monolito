import { createProduct, getStockById } from './products.handler';
import productRoutes from '../router/products.router';
import request from "supertest"
import express, { Express } from 'express'
import { Sequelize } from 'sequelize-typescript';
import { Umzug } from 'umzug';
import bodyParser from 'body-parser';

import { migrator } from '../../migrations/migrator';
import { ProductModel } from '../../modules/product-adm/repository/product.model';
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
    migration = migrator(sequelize)
    await migration.up()
  })

  afterEach(async () => {
    if (!migration || !sequelize) {
      return 
    }
    migration = migrator(sequelize)
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