import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import ItemModel from "../repository/invoice.item.model";
import GenerateInvoiceFacade from "./generate.invoice.facade";
import InvoinceGenerateUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceFactory from "../factory/GenerateInvoiceFactory";

describe("GenerateFacede test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ItemModel, InvoiceModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a invoice", async() => {    
    const input = {
      name: "John Doe",
      document: "123456789",
      street: "Main Street",
      number: "123",
      complement: "Apartment 4",
      city: "New York",
      state: "NY",
      zipCode: "12345",
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
      ]
    }

    // const repository = new InvoiceRepository()
    // const usecase = new InvoinceGenerateUseCase(repository);
    // const facade = new GenerateInvoiceFacade(usecase);

    const facade = GenerateInvoiceFactory.create();
    const output = await facade.process(input);

    expect(output.id).toBeDefined();
    expect(output.name).toBe(input.name);
    expect(output.document).toBe(input.document);
    expect(output.street).toBe(input.street);
    expect(output.number).toBe(input.number);
    expect(output.complement).toBe(input.complement);
    expect(output.city).toBe(input.city);
    expect(output.state).toBe(input.state);
    expect(output.zipCode).toBe(input.zipCode);
    expect(output.total).toBe(300);
    expect(output.items.length).toBe(2);
    expect(output.items[0].id).toBeDefined();
    expect(output.items[0].name).toBe(input.items[0].name);
    expect(output.items[0].price).toBe(input.items[0].price);
    expect(output.items[1].id).toBeDefined();
    expect(output.items[1].name).toBe(input.items[1].name);
    expect(output.items[1].price).toBe(input.items[1].price);
  })
})