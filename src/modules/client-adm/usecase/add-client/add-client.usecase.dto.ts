import Address from "../../../@shared/domain/value-object/address"


export interface AddClientInputDto {
  id?: string
  name: string
  email: string
  document: string
  address: Address
}

export interface AddClientOutputDto {
  id: string
  name: string
  email: string
  document: string
  street: string
  number: string
  complement: string
  city: string
  state: string
  zipCode: String
  createdAt: Date
  updatedAt: Date
}