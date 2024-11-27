import Address from "../../../@shared/domain/value-object/address"
import Id from "../../../@shared/domain/value-object/id.value-object"
import Client from "../../domain/client.entity"
import FindAllClientUseCase from "./find-all-client.usecase"
import FindClientUseCase from "./find-all-client.usecase"

const client1 = new Client({
  id: new Id("1"),
  name: "Lucian",
  email: "lucian@123.com",
  document: "1234-5678",
  address: new Address(
    "Rua 123",
    "99",
    "Casa Verde",
    "Criciúma",
    "SC",
    "88888-888",
  )
})

const client2 = new Client({
  id: new Id("2"),
  name: "Pedro",
  email: "pedro@123.com",
  document: "1234-5678",
  address: new Address(
    "Rua 123",
    "99",
    "Casa Verde",
    "Criciúma",
    "SC",
    "88888-888",
  )
})

const MockRepository = () => {

  return {
    add: jest.fn(),
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([client1, client2]))
  }
}

describe("Find Client use case unit test", () => {

  it("should find all clients", async () => {

    const repository = MockRepository()
    const usecase = new FindAllClientUseCase(repository)

    const result = await usecase.execute({})

    expect(repository.findAll).toHaveBeenCalled()    
    expect(result.length).toEqual(2)
    expect(result[0].name).toEqual(client1.name)
    expect(result[0].email).toEqual(client1.email)
    expect(result[1].name).toEqual(client2.name)
    expect(result[1].email).toEqual(client2.email)    
  })
})