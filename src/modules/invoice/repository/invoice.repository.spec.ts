import { Sequelize } from "sequelize-typescript";
import ItemModel from "./invoice.item.model";
import InvoiceModel from "./invoice.model";
import Invoice from "../domain/invoice";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";
import InvoiceRepository from "./invoice.repository";
import InvoiceItem from "../domain/invoiceItem";
import { Umzug } from "umzug";
import { migrator } from "../../../migrations/migrator";

describe("TransactionRepository test", () => {
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

  it("should save a invoice", async () => {
    const invoice = new Invoice({
      id: new Id("1"),
      name: "Maria",
      document: "123.456-78",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888",
      ),
      items: [ new InvoiceItem({
        id: new Id("1"),
        name: "Mesa",
        price: 349,  
      })]
    })

    const repository = new InvoiceRepository();
    const result = await repository.save(invoice);

    expect(result.id.id).toBe(invoice.id.id);
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.address.street).toBe(invoice.address.street);
    expect(result.address.number).toBe(invoice.address.number);
    expect(result.address.complement).toBe(invoice.address.complement);
    expect(result.address.city).toBe(invoice.address.city);
    expect(result.address.state).toBe(invoice.address.state);
    expect(result.address.zipCode).toBe(invoice.address.zipCode);
    expect(result.items[0].id.id).toBe(invoice.items[0].id.id);
    expect(result.items[0].name).toBe(invoice.items[0].name);
    expect(result.items[0].price).toBe(invoice.items[0].price);
    expect(result.getTotalPrice()).toBe(349);    
  })

})