import Invoice from "../domain/invoice";
import { FindInvoiceUseCaseOutputDTO } from "../usecase/find-invoice/find-invoice.dto";

export default interface InvoiceGateway {
  save(input: Invoice): Promise<Invoice>;
  find(id: string): Promise<Invoice>;
}
