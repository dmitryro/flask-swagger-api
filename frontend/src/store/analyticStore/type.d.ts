import { AnalyticStore as AnalyticStoreModel } from './index'

export as namespace IAnalyticStore

export interface AnalyticStore extends AnalyticStoreModel {}

export interface IAnalytic {
    id: number
}
