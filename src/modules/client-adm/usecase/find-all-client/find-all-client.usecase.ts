
import Address from "../../../@shared/domain/value-object/address";
import ClientGateway from "../../gateway/client.gateway";
import { FindAllClientUseCaseInputDto, FindAllClientUseCaseOutputDto } from "./find-all-client.usecase.dto";

export default class FindAllClientUseCase {

  private _clientRepository: ClientGateway

  constructor(clientRepository: ClientGateway) {
    this._clientRepository = clientRepository
  }

  async execute(input: FindAllClientUseCaseInputDto): Promise<FindAllClientUseCaseOutputDto[]> {

    const result = await this._clientRepository.findAll()

    return result.map((client) => ({
      id: client.id.id,
      name: client.name,
      email: client.email,
      document: client.document,
      address: new Address(
        client.address.street,
        client.address.number,
        client.address.complement,
        client.address.city,
        client.address.state,
        client.address.zipCode
      ),
      createdAt: client.createdAt,
      updatedAt: client.updatedAt
    }))
  }
}