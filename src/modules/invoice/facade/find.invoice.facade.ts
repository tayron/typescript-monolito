import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import FindInvoiceFacadeInterface, { FindInvoiceFacadeInputDTO, FindInvoiceFacadeOutputDTO } from "./find.invoice.facade.interface";

export default class FindInvoiceFacade implements FindInvoiceFacadeInterface {
  constructor(private processGenerateInvoiceUseCase: UseCaseInterface){}
  process(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceFacadeOutputDTO> {
    return this.processGenerateInvoiceUseCase.execute(input)
  }
  
}