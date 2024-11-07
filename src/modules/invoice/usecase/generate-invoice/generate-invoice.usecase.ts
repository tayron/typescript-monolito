import Address from "../../../@shared/domain/value-object/address"
import Id from "../../../@shared/domain/value-object/id.value-object"
import Invoice from "../../domain/invoice"
import InvoiceItem from "../../domain/invoiceItem"
import InvoiceGateway from "../../gateway/invoice.gateway"
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto"

export default class InvoinceGenerateUseCase {
  private _invoiceRepository: InvoiceGateway

  constructor(invoiceRepository: InvoiceGateway) {
    this._invoiceRepository = invoiceRepository
  }

  async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {    

    const invoiceInput = new Invoice({
      name: input.name,
      document: input.document,
      address: new Address(
        input.street,
        input.number,  
        input.complement,
        input.city,
        input.state,
        input.zipCode
      ),
      items: input.items.map((item) => {
        return new InvoiceItem({
          id: new Id(item.id),
          name: item.name,
          price: item.price,          
        });
      })
    });

    const invoiceOutput = await this._invoiceRepository.save(invoiceInput) 

    return {
      id: invoiceOutput.id.id,
      name: invoiceOutput.name,
      document: invoiceOutput.document,
      street: invoiceOutput.address.street,
      number: invoiceOutput.address.number,
      complement: invoiceOutput.address.complement,
      city: invoiceOutput.address.city,
      state: invoiceOutput.address.state,
      zipCode: invoiceOutput.address.zipCode,
      items: input.items.map((item) => {
        return {
          id: item.id,
          name: item.name,
          price: item.price,          
        };
      }),
      total: invoiceOutput.getTotalPrice(),    
    }
  }
}