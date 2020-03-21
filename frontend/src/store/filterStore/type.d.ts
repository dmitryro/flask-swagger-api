import { FilterStore as FilterStoreModel } from './index'

export as namespace IFilterStore

export interface FilterStore extends FilterStoreModel {}

export interface IFilter {
    _id?: string
    name: string
    category?: string
    createdAt?: string
}
