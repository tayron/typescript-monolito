import {Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import ItemModel from "../repository/invoice.item.model";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceFacade from "./find.invoice.facade";
import InvoinceFindUseCase from "../usecase/find-invoice/find-invoice.usecase";
import FindInvoiceFactory from "../factory/FindInvoiceFactory";
import { migrator } from "../../../migrations/migrator";
import { Umzug } from "umzug";

describe("FindFacede test", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    await sequelize.addModels([ItemModel, InvoiceModel]);
    migration = migrator(sequelize, false)
    await migration.up()
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return 
    }    
    migration = migrator(sequelize, false)
    await migration.down()
    await sequelize.close()
  });

  it("should create a invoice", async() => {    
    const input = {
      id: "1",
      name: "John Doe",
      document: "123456789",
      street: "Main Street",
      number: "123",
      complement: "Apartment 4",
      city: "New York",
      state: "NY",
      zipcode: "12345",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100
        },
        {
          id: "2",
          name: "Item 2",
          price: 200
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await InvoiceModel.create(input);
/*
    const repository = new InvoiceRepository()
    const usecase = new InvoinceFindUseCase(repository);
    const facade = new FindInvoiceFacade(usecase);
*/
    const facade = FindInvoiceFactory.create();
    const output = await facade.process({id: "1"});

    expect(output.id).toBe("1");
    //expect(output.name).toBe(input.name);
  })
})