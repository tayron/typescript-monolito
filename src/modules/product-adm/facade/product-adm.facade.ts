import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { FindAllProductOutputDto } from "../usecase/add-product/find-all-product.dto";
import ProductAdmFacadeInterface, {
  AddProductFacadeInputDto,
  CheckStockFacadeInputDto,
  CheckStockFacadeOutputDto,
} from "./product-adm.facade.interface";

export interface UseCasesProps {
  addUseCase: UseCaseInterface;
  findAllUseCase: UseCaseInterface;
  stockUseCase: UseCaseInterface;
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface {
  private _addUsecase: UseCaseInterface;
  private _findAllUsecase: UseCaseInterface;
  private _checkStockUsecase: UseCaseInterface;

  constructor(usecasesProps: UseCasesProps) {
    this._addUsecase = usecasesProps.addUseCase;
    this._findAllUsecase = usecasesProps.findAllUseCase;
    this._checkStockUsecase = usecasesProps.stockUseCase;
  }

  async addProduct(input: AddProductFacadeInputDto): Promise<void> {  
    return await this._addUsecase.execute(input);
  }

  async findAllProducts(): Promise<FindAllProductOutputDto[]> {
    return await this._findAllUsecase.execute(null);
  }
  
  async checkStock(
    input: CheckStockFacadeInputDto
  ): Promise<CheckStockFacadeOutputDto> {
    return await this._checkStockUsecase.execute(input);
  }
}
