import GenerateInvoiceFacade from "../facade/generate.invoice.facade";
import GenerateInvoiceFacadeInterface from "../facade/generate.invoice.facade.interface";
import InvoiceRepository from "../repository/invoice.repository";
import InvoinceGenerateUseCase from "../usecase/generate-invoice/generate-invoice.usecase";

export default class GenerateInvoiceFactory {
  static create(): GenerateInvoiceFacadeInterface {
    const repository = new InvoiceRepository()
    const usecase = new InvoinceGenerateUseCase(repository);
    return new GenerateInvoiceFacade(usecase);
  }
}
