import InvoiceGateway from "../../gateway/invoice.gateway"
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find-invoice.dto"


export default class InvoinceFindUseCase {
  private _invoiceRepository: InvoiceGateway

  constructor(invoiceRepository: InvoiceGateway) {
    this._invoiceRepository = invoiceRepository
  }

  async execute(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {    
    const invoiceOutput = await this._invoiceRepository.find(input.id)

    return {
      id: invoiceOutput.id.id,
      name: invoiceOutput.name,
      document: invoiceOutput.document,
      address: {
        street: invoiceOutput.address.street,
        number: invoiceOutput.address.number,
        complement: invoiceOutput.address.complement,
        city: invoiceOutput.address.city,
        state: invoiceOutput.address.state,
        zipCode: invoiceOutput.address.zipCode,
      },
      items: invoiceOutput.items.map((item) => {
        return {
          id: item.id.id,
          name: item.name,
          price: item.price,          
        };
      }),
      total: invoiceOutput.getTotalPrice(),  
      createdAt: invoiceOutput.createdAt  
    }
  }
}