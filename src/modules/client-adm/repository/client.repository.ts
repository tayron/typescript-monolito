import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import ClientGateway from "../gateway/client.gateway";
import ClientModel from "./client.model";

export default class ClientRepository implements ClientGateway {

  async add(entity: Client): Promise<void> {

    await ClientModel.create({
      id: entity.id.id,
      name: entity.name,
      email: entity.email,
      document: entity.document,
      street: entity.address.street,
      number: entity.address.number,
      complement: entity.address.complement,
      city: entity.address.city,
      state: entity.address.state,
      zipcode: entity.address.zipCode,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    })
  }

  async find(id: string): Promise<Client> {
    const client = (await ClientModel.findOne({ where: { id } }))

    if (!client) {
      throw new Error("Client not found")
    }

    const data = client.dataValues

    return new Client({
      id: new Id(data.id),
      name: data.name,
      email: data.email,
      document: data.document,
      address: new Address(
        data.street,
        data.number,
        data.complement,
        data.city,
        data.state,
        data.zipcode,
      ),
      createdAt: data.createdAt,
      updatedAt: data.createdAt
    })
  }

  async findAll(): Promise<Client[]> {
    const clients = (await ClientModel.findAll()).map((client) => client.dataValues)
    return clients.map((client) => new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      document: client.document,
      address: new Address(
        client.street,
        client.number,
        client.complement,
        client.city,
        client.state,
        client.zipcode,
      ),
      createdAt: client.createdAt,
      updatedAt: client.createdAt
    }))
  }
}