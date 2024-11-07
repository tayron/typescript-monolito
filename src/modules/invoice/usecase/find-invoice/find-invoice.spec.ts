import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoince from "../../domain/invoice";
import InvoiceItem from "../../domain/invoiceItem";
import InvoinceFindUseCase from "./find-invoice.usecase";

const invoice = new Invoince({
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
    save: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice))
  }
}

describe("Find invoice usecase unit test", () => {
  it("should find invoice", async() => {
    const invoiceRepository = MockRepository();
    const usecase = new InvoinceFindUseCase(invoiceRepository);

    const input = {
      id: "1"
    }

    const result = await usecase.execute(input);
    expect(invoiceRepository.find).toHaveBeenCalled();
    expect(result.id).toBe(invoice.id.id);
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.address.street).toBe(invoice.address.street);
    expect(result.address.number).toBe(invoice.address.number);
    expect(result.address.complement).toBe(invoice.address.complement);
    expect(result.address.city).toBe(invoice.address.city);
    expect(result.address.state).toBe(invoice.address.state);
    expect(result.address.zipCode).toBe(invoice.address.zipCode);
    expect(result.items[0].id).toBe(invoice.items[0].id.id)
    expect(result.items[0].name).toBe(invoice.items[0].name)
    expect(result.items[0].price).toBe(invoice.items[0].price)
  })
})