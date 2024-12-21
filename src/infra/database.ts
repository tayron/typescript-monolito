import { Sequelize } from 'sequelize-typescript';
import ProductModel from '../modules/product-adm/repository/product.model';
import ClientModel from '../modules/client-adm/repository/client.model';
import InvoiceModel from '../modules/invoice/repository/invoice.model';
import InvoiceItemModel from '../modules/invoice/repository/invoice.item.model';
import TransactionModel from '../modules/payment/repository/transaction.model';
import OrderModel from '../modules/checkout/repository/order.model';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.db',
  logging: false,
});

sequelize.addModels([
  ProductModel, 
  ClientModel,
  OrderModel,
  InvoiceModel,
  InvoiceItemModel,
  TransactionModel,
])

export default sequelize;
