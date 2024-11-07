import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface"
import BaseEntity from "../../@shared/domain/entity/base.entity"
import Address from "../../@shared/domain/value-object/address"
import Id from "../../@shared/domain/value-object/id.value-object"
import InvoiceItem from "./invoiceItem"
import InvoiceItems from "./invoiceItem"

type InvoiceProps = {
  id?: Id // criado automaticamente
  name: string
  document: string
  address: Address // value object
  items: InvoiceItems[] // Invoice Items entity
  createdAt?: Date // criada automaticamente
  updatedAt?: Date // criada automaticamente
}

export default class Invoice extends BaseEntity implements AggregateRoot {
  private _name: string
  private _document: string
  private _address: Address
  private _items: InvoiceItem[]

  constructor(props: InvoiceProps) {
    super(props.id);

    this._name = props.name
    this._document = props.document
    this._address = props.address
    this._items = props.items
  }

  get name(): string {
    return this._name
  }

  get document(): string {
    return this._document
  }  

  get address(): Address {
    return this._address
  }

  get items(): InvoiceItems[] {
    return this._items
  }

  getTotalPrice(): number {
    var total = 0
    this._items.forEach(function(item){
      total += item.price
    })
    return total
  } 
}