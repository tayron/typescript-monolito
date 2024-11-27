import Address from "../../../@shared/domain/value-object/address"

export interface FindAllClientUseCaseInputDto {}

export interface FindAllClientUseCaseOutputDto {
  id: string
  name: string
  email: string
  document: string
  address: Address
  createdAt: Date
  updatedAt: Date
}