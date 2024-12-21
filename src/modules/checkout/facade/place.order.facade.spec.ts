import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { migrator } from "../../../migrations/migrator";
import OrderModel from "../repository/order.model";
import ClientModel from "../../client-adm/repository/client.model";
import PlaceOrderFactory from "../factory/place.order.factory";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import ProductStoreModel from "../../store-catalog/repository/product.model";
import ProductModel from "../../product-adm/repository/product.model";
import TransactionModel from "../../payment/repository/transaction.model";

describe("Checkout Facede test", () => {

  let sequelize: Sequelize
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    })

    sequelize.addModels([ProductStoreModel, ProductModel, TransactionModel, OrderModel, ClientModel])
    migration = migrator(sequelize)
    await migration.up()
    //await sequelize.sync({ force: true });

  })

  afterEach(async () => {
    if (!migration || !sequelize) {
      return 
    }    
    migration = migrator(sequelize)
    await migration.down()    
    await sequelize.drop()
    await sequelize.close() 
  })

  it("should create a order", async () => {

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
    
    const product = {
        id: "1",
        name: "Produto 1",
        description: "Produto 1",
        purchasePrice: 10,
        salesPrice: 15,
        stock: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
    
    await ProductStoreModel.create(product)    
    
    const productDb = (await ProductStoreModel.findOne({
      where: { id: "1" },
    })).dataValues

    expect(productDb.id).toBe(product.id)
    expect(productDb.name).toBe(product.name)
    expect(productDb.description).toBe(product.description)
    expect(productDb.salesPrice).toBe(product.salesPrice)


    const input = {
      clientId: client.id.id,
      products: [{productId: product.id}]
    }

    const usercase = PlaceOrderFactory.create()
    console.warn("# usecase criado")
    const output = await usercase.execute(input)
    console.warn(output)
    console.warn("# usecase executado")

    
    console.warn(output)

  })
})