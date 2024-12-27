import request from "supertest"
import express, { Express } from 'express'
import { Sequelize } from 'sequelize-typescript';
import { Umzug } from 'umzug';
import bodyParser from 'body-parser';
import { migrator } from '../../migrations/migrator';
import ClientAdmFacadeFactory from '../../modules/client-adm/factory/client-adm.facade.factory';
import router from '../router';
import ClientModel from "../../modules/client-adm/repository/client.model";


describe("POST /clients", () => {

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
    
    sequelize.addModels([ClientModel])
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

  it("should create clients with successfully", async () => {
    const output = await request(app)
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

    expect(output.status).toBe(201)
  })

  it("should check if existe created clients", async () => {
    const outputCreateClients1 = await request(app)
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
    const outputCreateClients2 = await request(app)
      .post("/api/v1/clients")
      .send({
        "name": "Pedro",
        "email": "pedro@xpto.com",
        "document": "1234-5678",      
        "street": "Rua 123",
        "number": "99",
        "complement": "Casa Verde",
        "city": "Criciúma",
        "state": "SC",
        "zipCode": "88888-888"
    })    

    expect(outputCreateClients1.status).toBe(201)
    expect(outputCreateClients2.status).toBe(201)

    const factory = ClientAdmFacadeFactory.create()
    const clients = await factory.findAll()
    expect(clients.length).toBe(2)
  })  
})