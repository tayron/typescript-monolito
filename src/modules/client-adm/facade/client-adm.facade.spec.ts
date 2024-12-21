import { Sequelize } from "sequelize-typescript"
import ClientModel from "../repository/client.model"
import ClientRepository from "../repository/client.repository"
import AddClientUseCase from "../usecase/add-client/add-client.usecase"
import ClientAdmFacade from "./client-adm.facade"
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory"
import Address from "../../@shared/domain/value-object/address"
import { Umzug } from "umzug"
import { migrator } from "../../../migrations/migrator"


describe("Client Adm Facade test", () => {

  let sequelize: Sequelize
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    })

    sequelize.addModels([ClientModel])
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

  it("should create a client", async () => {

    const repository = new ClientRepository()
    const addUsecase = new AddClientUseCase(repository)
    const facade = new ClientAdmFacade({
      addUsecase: addUsecase,
      findUsecase: undefined,
      findAllUsecase: undefined
    })

    const input = {
      id: "1",
      name: "Lucian",
      email: "lucian@xpto.com",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888",
      )
    }

    await facade.add(input)

    const client = (await ClientModel.findOne({ where: { id: "1" } })).dataValues

    expect(client).toBeDefined()
    expect(client.id).toBe(input.id)
    expect(client.name).toBe(input.name)
    expect(client.email).toBe(input.email)
    expect(client.document).toBe(input.document)
    expect(client.street).toBe(input.address.street)
  })

  it("should find a client", async () => {
    const facade = ClientAdmFacadeFactory.create()

    const input = {
      id: "1",
      name: "Lucian",
      email: "lucian@xpto.com",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      )
    }

    await facade.add(input)

    const client = await facade.find({ id: "1" })

    expect(client).toBeDefined()
    expect(client.id).toBe(input.id)
    expect(client.name).toBe(input.name)
    expect(client.email).toBe(input.email)
    expect(client.document).toBe(input.document)
    expect(client.address.street).toBe(input.address.street)
    expect(client.address.number).toBe(input.address.number)
    expect(client.address.complement).toBe(input.address.complement)
    expect(client.address.city).toBe(input.address.city)
    expect(client.address.state).toBe(input.address.state)
    expect(client.address.zipCode).toBe(input.address.zipCode)
  })

it("should find all clients", async () => {
    const facade = ClientAdmFacadeFactory.create()

    const client1 = {
      id: "1",
      name: "Lucian",
      email: "lucian@xpto.com",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      )
    }

    const client2 = {
      id: "2",
      name: "Maria",
      email: "maria@xpto.com",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      )
    }    

    await facade.add(client1)
    await facade.add(client2)

    const clients = await facade.findAll()

    expect(clients).toBeDefined()
    expect(clients[0].id).toBe(client1.id)
    expect(clients[0].name).toBe(client1.name)
    expect(clients[0].email).toBe(client1.email)
    expect(clients[1].id).toBe(client2.id)
    expect(clients[1].name).toBe(client2.name)
    expect(clients[1].email).toBe(client2.email)
  })  
})