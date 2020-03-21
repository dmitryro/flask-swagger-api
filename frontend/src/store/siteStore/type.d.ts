import { SiteStore as SiteStoreModel } from './index'

export as namespace ISiteStore

export interface SiteStore extends SiteStoreModel {}

export interface ISite {
    _id?: string
    address?: string
    ga?: string
    createdAt?: string
}
