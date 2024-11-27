import ClientAdmFacade from "../facade/client-adm.facade";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import FindAllClientUseCase from "../usecase/find-all-client/find-all-client.usecase";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";

export default class ClientAdmFacadeFactory {
  static create() {
    const repository = new ClientRepository();
    const findUsecase = new FindClientUseCase(repository);
    const findAllUsecase = new FindAllClientUseCase(repository);
    const addUsecase = new AddClientUseCase(repository);

    const facade = new ClientAdmFacade({
      addUsecase: addUsecase,
      findUsecase: findUsecase,
      findAllUsecase: findAllUsecase,
    });

    return facade;
  }
}
