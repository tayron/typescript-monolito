import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import ProductGateway from "../../gateway/product.gateway";
import { FindAllProductOutputDto } from "./find-all-product.dto";

export default class FindAllProductUseCase {
  private _productRepository: ProductGateway;

  constructor(_productRepository: ProductGateway) {
    this._productRepository = _productRepository;
  }

  async execute(): Promise<FindAllProductOutputDto[]> {
    const products = await this._productRepository.findAll();

    return products.map((product: Product) => {
      return {
        id: product.id.id,
        name: product.name,
        description: product.description,
        purchasePrice: product.purchasePrice,
        salesPrice: product.salesPrice,
        stock: product.stock,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });
  }
}
