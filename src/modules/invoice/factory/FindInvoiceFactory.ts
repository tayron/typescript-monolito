
import FindInvoiceFacade from "../facade/find.invoice.facade";
import FindInvoiceFacadeInterface from "../facade/find.invoice.facade.interface";
import InvoiceRepository from "../repository/invoice.repository";
import InvoinceFindUseCase from "../usecase/find-invoice/find-invoice.usecase";

export default class FindInvoiceFactory {
  static create(): FindInvoiceFacadeInterface {
    const repository = new InvoiceRepository()
    const usecase = new InvoinceFindUseCase(repository);
    return new FindInvoiceFacade(usecase);    
  }
}
