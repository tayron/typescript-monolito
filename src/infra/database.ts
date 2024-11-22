import { Sequelize } from 'sequelize-typescript';
import { ProductModel } from '../modules/product-adm/repository/product.model';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.db',
  logging: false,
});

sequelize.addModels([ProductModel])

export default sequelize;
