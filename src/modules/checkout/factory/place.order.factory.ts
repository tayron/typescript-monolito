import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import GenerateInvoiceFactory from "../../invoice/factory/GenerateInvoiceFactory";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import OrderRepository from "../repository/order.repository";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

export default class PlaceOrderFactory {
  static create() {
    const clientFacade = ClientAdmFacadeFactory.create() 
    const productFacade = ProductAdmFacadeFactory.create()
    const storeCatalogFacade = StoreCatalogFacadeFactory.create()
    const orderRepository = new OrderRepository()
    const generateInvoidFactory = GenerateInvoiceFactory.create()
    const paymentFacade = PaymentFacadeFactory.create()

    return new PlaceOrderUseCase(
      clientFacade,
      productFacade,
      storeCatalogFacade,
      orderRepository,
      generateInvoidFactory,
      paymentFacade
    )
  }
}