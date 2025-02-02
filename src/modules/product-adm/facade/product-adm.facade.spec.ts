import { Sequelize } from "sequelize-typescript";
import ProductAdmFacadeFactory from "../factory/facade.factory";
import ProductModel from "../../@shared/model/product.model";
import { Umzug } from "umzug";
import { migrator } from "../../../migrations/migrator";

describe("ProductAdmFacade test", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    await sequelize.addModels([ProductModel]);
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

  it("should create a product", async () => {
    const productFacade = ProductAdmFacadeFactory.create();

    const input = {
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 10,
      salesPrice: 15,
      stock: 10,
    };

    await productFacade.addProduct(input);

    const product = (await ProductModel.findOne({ where: { id: "1" } })).dataValues;
    expect(product).toBeDefined();
    expect(product.id).toBe(input.id);
    expect(product.name).toBe(input.name);
    expect(product.description).toBe(input.description);
    expect(product.purchasePrice).toBe(input.purchasePrice);
    expect(product.stock).toBe(input.stock);
  });

  it("should check product stock", async () => {
    const productFacade = ProductAdmFacadeFactory.create();
    const input = {
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 10,
      salesPrice: 15,
      stock: 10,
    };
    await productFacade.addProduct(input);

    const result = await productFacade.checkStock({ productId: "1" });

    expect(result.productId).toBe(input.id);
    expect(result.stock).toBe(input.stock);
  });
});
