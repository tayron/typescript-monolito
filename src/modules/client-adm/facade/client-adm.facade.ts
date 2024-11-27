import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { FindAllClientUseCaseOutputDto } from "../usecase/find-all-client/find-all-client.usecase.dto";
import ClientAdmFacadeInterface, {
  AddClientFacadeInputDto,
  FindClientFacadeInputDto,
  FindClientFacadeOutputDto,
} from "./client-adm.facade.interface";

export interface UseCaseProps {
  findUsecase: UseCaseInterface;
  findAllUsecase: UseCaseInterface,
  addUsecase: UseCaseInterface;
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {
  private _findUsecase: UseCaseInterface;
  private _findAllUsecase: UseCaseInterface
  private _addUsecase: UseCaseInterface;

  constructor(usecaseProps: UseCaseProps) {
    this._findUsecase = usecaseProps.findUsecase;
    this._findAllUsecase = usecaseProps.findAllUsecase;
    this._addUsecase = usecaseProps.addUsecase;
  }

  async add(input: AddClientFacadeInputDto): Promise<void> {
    await this._addUsecase.execute(input);
  }

  async find(
    input: FindClientFacadeInputDto
  ): Promise<FindClientFacadeOutputDto> {
    return await this._findUsecase.execute(input);
  }

  async findAll(): Promise<FindAllClientUseCaseOutputDto[]> {
    return await this._findAllUsecase.execute({})
  }
}
