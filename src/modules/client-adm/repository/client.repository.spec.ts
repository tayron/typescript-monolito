import { Sequelize } from "sequelize-typescript"
import ClientModel from "./client.model"
import ClientRepository from "./client.repository"
import Client from "../domain/client.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import Address from "../../@shared/domain/value-object/address"
import { Umzug } from "umzug"
import { migrator } from "../../../migrations/migrator"

describe("Client Repository test", () => {

  let sequelize: Sequelize
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
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
    await sequelize.drop()
    await sequelize.close()    
  })

  it("should create a client", async () => {

    const client = new Client({
      id: new Id("1"),
      name: "Lucian",
      email: "lucian@teste.com",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      )
    })

    const repository = new ClientRepository()
    await repository.add(client)

    const clientDb = (await ClientModel.findOne({ where: { id: "1" } })).dataValues    
    
    expect(clientDb).toBeDefined()
    expect(clientDb.id).toEqual(client.id.id)
    expect(clientDb.name).toEqual(client.name)
    expect(clientDb.email).toEqual(client.email)
    expect(clientDb.document).toEqual(client.document)
    expect(clientDb.street).toEqual(client.address.street)
    expect(clientDb.number).toEqual(client.address.number)
    expect(clientDb.complement).toEqual(client.address.complement)
    expect(clientDb.city).toEqual(client.address.city)
    expect(clientDb.state).toEqual(client.address.state)
    expect(clientDb.zipcode).toEqual(client.address.zipCode)
    expect(clientDb.createdAt).toStrictEqual(client.createdAt)
    expect(clientDb.updatedAt).toStrictEqual(client.updatedAt)
  })

  it("should find a client", async () => {
    const client = (await ClientModel.create({
      id: '1',
      name: 'Lucian',
      email: 'lucian@123.com',
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipcode: "88888-888",      
      createdAt: new Date(),
      updatedAt: new Date()
    })).dataValues

    const repository = new ClientRepository()
    const result = await repository.find(client.id)

    expect(result.id.id).toEqual(client.id)
    expect(result.name).toEqual(client.name)
    expect(result.email).toEqual(client.email)
    expect(result.address.street).toEqual(client.street)
    expect(result.address.number).toEqual(client.number)
    expect(result.address.complement).toEqual(client.complement)
    expect(result.address.city).toEqual(client.city)
    expect(result.address.state).toEqual(client.state)
    expect(result.address.zipCode).toEqual(client.zipcode)
    expect(result.createdAt).toStrictEqual(client.createdAt)
    expect(result.updatedAt).toStrictEqual(client.updatedAt)
  })

  it("should find all clients", async () => {
    const client1 = (await ClientModel.create({
      id: '1',
      name: 'Lucian',
      email: 'lucian@123.com',
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipcode: "88888-888",      
      createdAt: new Date(),
      updatedAt: new Date()
    })).dataValues
    
    const client2 = (await ClientModel.create({
      id: '2',
      name: 'Maria',
      email: 'maria@123.com',
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipcode: "88888-888",      
      createdAt: new Date(),
      updatedAt: new Date()
    })).dataValues  
    
    const repository = new ClientRepository()
    const result = await repository.findAll()    

    expect(result.length).toEqual(2)
    expect(result[0].id.id).toEqual(client1.id)
    expect(result[0].name).toEqual(client1.name)
    expect(result[1].id.id).toEqual(client2.id)
    expect(result[1].name).toEqual(client2.name)    
  })
})