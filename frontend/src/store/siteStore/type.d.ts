import { SiteStore as SiteStoreModel } from './index'

export as namespace ISiteStore

export interface SiteStore extends SiteStoreModel {}

export interface ISite {
    id: number
    date_added: date
    date_last_crawled: date
    port: number
    ip: string
    host: string
    ga: string
}
