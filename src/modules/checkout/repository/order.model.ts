import { BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
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

  @ForeignKey(() => require('../../client-adm/repository/client.model').default)
  @Column({ allowNull: false })
  declare clientId: string;

  @BelongsTo(() => require('../../client-adm/repository/client.model').default, { foreignKey: "id" })
  declare client: ClientModel;

  @HasMany(() => require('./order.item.model').default)  
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