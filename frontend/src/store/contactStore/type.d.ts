import { ContactStore as ContactStoreModel } from './index'

export as namespace IContactStore

export interface ContactStore extends ContactStoreModel {}

export interface IContact {
    id: number
    name: string
}
