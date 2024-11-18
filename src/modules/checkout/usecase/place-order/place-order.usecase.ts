import { number } from "yup";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/chackout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto.";
import GenerateInvoiceFacadeInterface from "../../../invoice/facade/generate.invoice.facade.interface";

export default class PlaceOrderUserCase implements UseCaseInterface {

  private _clientFacade: ClientAdmFacadeInterface;
  private _productFacade: ProductAdmFacadeInterface;
  private _catalogFacade: StoreCatalogFacadeInterface;
  private _checkoutRepository: CheckoutGateway;
  private _invoiceFacade: GenerateInvoiceFacadeInterface;
  private _paymentFacade: PaymentFacadeInterface;

  constructor(
    clientFacade: ClientAdmFacadeInterface, 
    productFacade: ProductAdmFacadeInterface,
    storeCatalog: StoreCatalogFacadeInterface,
    checkoutRepository: CheckoutGateway,
    invoiceFacade: GenerateInvoiceFacadeInterface,
    paymentFacade: PaymentFacadeInterface
  ) {
    this._clientFacade = clientFacade;
    this._productFacade = productFacade;
    this._catalogFacade = storeCatalog;
    this._checkoutRepository = checkoutRepository;
    this._invoiceFacade = invoiceFacade;
    this._paymentFacade = paymentFacade;
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> { 
    
    const client = await this._clientFacade.find(
      {id: input.clientId}
    )

    if (!client) {
      throw new Error("Client not found")
    }

    await this.validateProducts(input)

    const products = await Promise.all(
      input.products.map(async (product) => this.getProduct(product.productId))
    );

    const myClient = new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      address: client.address.street,
    })

    const order = new Order({
      client: myClient,
      products: products,
    });

    const payment = await this._paymentFacade.process({
      orderId: order.id.id,
      amount: order.total
    })

    const invoice = payment.status === "approved" ?
      await this._invoiceFacade.process({
        name: client.name,
        document: client.document,
        street: client.address.street,
        number: client.address.number,
        complement: client.address.complement,
        city: client.address.city,
        state: client.address.state,
        zipCode: client.address.zipCode,
        items: products.map((product) => ({
          id: product.id.id,
          name: product.name,
          price: product.salesPrice
        })),        
      }) : null

    payment.status == "approved" && order.aproved();
    this._checkoutRepository.addOrder(order);

    return {
      id: order.id.id,
      invoiceId: payment.status === "approved" ? invoice.id : null,
      status: order.status,
      total: order.total,
      products: order.products.map((product) => ({
        productId: product.id.id,
        name: product.name,
        salesPrice: product.salesPrice        
      }))
    }
  }

  async validateProducts(input: PlaceOrderInputDto): Promise<void> {
    if (input.products.length === 0) {
      throw new Error("No products selected")
    }

    for(const product of input.products) {
      const productStock = await this._productFacade.checkStock({productId: product.productId})

      if (productStock.stock <= 0) {
        throw new Error(`Product ${product.productId} is not available in stock`)
      }
    }
  }

  private async getProduct(productId: string): Promise<Product> {
    const product = await this._catalogFacade.find({id: productId})

    if (!product) {
      throw new Error("Product not found")
    }

    const productProps = {
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice
    }

    return new Product(productProps)
  }
}