import { Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  tableName: "orders_items",
  timestamps: false,
})
export default class OrderItemModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string

  @Column({ allowNull: false })
  declare name: string

  @Column({ allowNull: false })
  declare salesPrice: number

  @ForeignKey(() => require('../../@shared/model/product.model').default) // Importação dinâmica  
  declare productId: string;

  @ForeignKey(() => require('./order.model').default)  
  declare orderId: string;

  @Column({ allowNull: false })
  declare createdAt: Date

  @Column({ allowNull: false })
  declare updatedAt: Date
}