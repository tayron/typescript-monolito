import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import GenerateInvoiceFacadeInterface, { GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./generate.invoice.facade.interface";

export default class GenerateInvoiceFacade implements GenerateInvoiceFacadeInterface {
  constructor(private processGenerateInvoiceUseCase: UseCaseInterface){}
  process(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
    return this.processGenerateInvoiceUseCase.execute(input)
  }
  
}