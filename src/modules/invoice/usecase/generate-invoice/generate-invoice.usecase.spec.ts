import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice";
import InvoiceItem from "../../domain/invoiceItem";
import InvoiceGenerateUseCase from "./generate-invoice.usecase";

const invoice = new Invoice({
  id: new Id("1"),
  name: "Maria",
  document: "123.456-78",
  address: new Address(
    "Rua 123",
    "99",
    "Casa Verde",
    "Criciúma",
    "SC",
    "88888-888",
  ),
  items: [new InvoiceItem({
    id: new Id("1"),
    name: "Mesa",
    price: 349,  
  })]
})

const MockRepository = () => {
  return {
    save: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    find: jest.fn()
  }
}

describe("Generate invoice usecase unit test", () => {
  it("should generate invoice", async() => {
    const invoiceRepository = MockRepository();
    const usecase = new InvoiceGenerateUseCase(invoiceRepository);

    const input = {
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      items: [{
        id: invoice.items[0].id.id,
        name: invoice.items[0].name,
        price: invoice.items[0].price
      }]
    }

    const result = await usecase.execute(input);
    expect(invoiceRepository.save).toHaveBeenCalled();
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.street).toBe(invoice.address.street);
    expect(result.number).toBe(invoice.address.number);
    expect(result.complement).toBe(invoice.address.complement);
    expect(result.city).toBe(invoice.address.city);
    expect(result.state).toBe(invoice.address.state);
    expect(result.zipCode).toBe(invoice.address.zipCode);
    expect(result.items[0].id).toBe(invoice.items[0].id.id)
    expect(result.items[0].name).toBe(invoice.items[0].name)
    expect(result.items[0].price).toBe(invoice.items[0].price)
  })
})