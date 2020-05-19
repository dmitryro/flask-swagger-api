import { ChainStore as ChainStoreModel } from './index'

export as namespace IChainStore

export interface ChainStore extends ChainStoreModel {}

export interface IChain {
    id: number
}
