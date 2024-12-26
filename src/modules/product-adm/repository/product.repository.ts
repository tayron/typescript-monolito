import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import ProductModel from "./product.model";

export default class ProductRepository implements ProductGateway {
  async add(product: Product): Promise<void> {
    await ProductModel.create({
      id: product.id.id,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: new Date(),
      updatedAt: new Date(),
    });  
  }  

  async find(id: string): Promise<Product> {
    const product = await ProductModel.findOne({
      where: {
        id: id,
      },
    })

    if (!product) {
      throw new Error(`Product with id ${id}not found`);
    }

    const productData = product.dataValues

    return new Product({
      id: new Id(productData.id),
      name: productData.name,
      description: productData.description,
      salesPrice: productData.salesPrice,
      purchasePrice: productData.purchasePrice,
      stock: productData.stock,
      createdAt: productData.createdAt,
      updatedAt: productData.updatedAt,
    });
  }

  async findAll(): Promise<Product[]> {
    const products = await ProductModel.findAll();

    return products.map((product) => {
      return new Product({
        id: new Id(product.id),
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
        purchasePrice: product.purchasePrice,
        stock: product.stock,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      });
    });
  }
}
