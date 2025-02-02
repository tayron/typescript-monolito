import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductModel from "../../@shared/model/product.model";
import ProductRepository from "./product.repository";
import { migrator } from "../../../migrations/migrator";
import { Umzug } from "umzug";

describe("ProductRepository test", () => {
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

    it("should create a product without id", async () => {
    const productProps = {
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      salesPrice: 115,      
      stock: 10,
    };

    const product = new Product(productProps);
    const productRepository = new ProductRepository();
    await productRepository.add(product);

    const productDb = (await ProductModel.findAll());    
    
    expect(productProps.name).toEqual(productDb[0].dataValues.name);
    expect(productProps.description).toEqual(productDb[0].dataValues.description);
    expect(productProps.salesPrice).toEqual(productDb[0].dataValues.salesPrice);
    expect(productProps.purchasePrice).toEqual(productDb[0].dataValues.purchasePrice);
    expect(productProps.stock).toEqual(productDb[0].dataValues.stock);
  });

  it("should create a product with id", async () => {
    const productProps = {
      id: new Id("1"),
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 115,
      purchasePrice: 100,
      stock: 10,
    };
    const product = new Product(productProps);
    const productRepository = new ProductRepository();
    await productRepository.add(product);

    const productDb = (await ProductModel.findOne({
      where: { id: productProps.id.id },
    })).dataValues;

    expect(productProps.id.id).toEqual(productDb.id);
    expect(productProps.name).toEqual(productDb.name);
    expect(productProps.description).toEqual(productDb.description);
    expect(productProps.purchasePrice).toEqual(productDb.purchasePrice);
    expect(productProps.stock).toEqual(productDb.stock);
  });

  it("should find a product", async () => {
    const productRepository = new ProductRepository();

    ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 115,
      purchasePrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const product = await productRepository.find("1");

    expect(product.id.id).toEqual("1");
    expect(product.name).toEqual("Product 1");
    expect(product.description).toEqual("Product 1 description");
    expect(product.purchasePrice).toEqual(100);
    expect(product.stock).toEqual(10);
  });

  it("should find all products", async () => {
    const productRepository = new ProductRepository();

    ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 115,
      purchasePrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    ProductModel.create({
      id: "2",
      name: "Product 2",
      description: "Product 2 description",
      salesPrice: 2015,
      purchasePrice: 200,
      stock: 20,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const products = await productRepository.findAll();

    expect(products.length).toEqual(2);
    expect(products[0].id.id).toEqual("1");
    expect(products[0].name).toEqual("Product 1");
    expect(products[0].description).toEqual("Product 1 description");
    expect(products[0].purchasePrice).toEqual(100);
    expect(products[0].stock).toEqual(10);
    expect(products[1].id.id).toEqual("2");
    expect(products[1].name).toEqual("Product 2");
    expect(products[1].description).toEqual("Product 2 description");
    expect(products[1].purchasePrice).toEqual(200);
    expect(products[1].stock).toEqual(20);
  })
});
