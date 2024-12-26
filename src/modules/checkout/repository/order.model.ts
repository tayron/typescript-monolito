import { BelongsTo, Column, ForeignKey, HasMany, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import ProductModel from "../../product-adm/repository/product.model";
import ClientModel from "../../client-adm/repository/client.model";
import OrderItemModel from "./order.item.model";


@Table({
  tableName: "orders",
  timestamps: false,
})
export default class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @ForeignKey(() => ClientModel)
  @Column({ allowNull: false })
  declare clientId: string;

  @BelongsTo(() => ClientModel, { foreignKey: "id" })
  declare client: ClientModel;

  @HasMany(() => OrderItemModel)  
  declare items: OrderItemModel[]

  @Column({ allowNull: false })
  declare total: number;

  @Column({ allowNull: false })
  declare status: string;

  @Column({ allowNull: false })
  declare createdAt: Date

  @Column({ allowNull: false })
  declare updatedAt: Date
}  