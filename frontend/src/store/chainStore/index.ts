import { observable, action, runInAction } from 'mobx'
import { PaginationConfig } from 'antd/lib/pagination'

import { StoreExt } from '@utils/reactExt'

export class ChainStore extends StoreExt {
    /**
     * @memberof ChainStore
     */
    @observable
    getChainsloading = false
    /**
     * 用户列表
     *
     * @type {IChainStore.IChain[]}
     * @memberof ChainStore
     */
    @observable
    chains: IChainStore.IChain[] = []
    /**
     * table pageIndex
     *
     * @memberof ChainStore
     */
    @observable
    pageIndex = 1
    /**
     * table pageSize
     *
     * @memberof ChainStore
     */
    @observable
    pageSize = 30
    /**
     * chains total
     *
     * @memberof ChainStore
     */
    @observable
    total = 0

    /**
     * 加载用户列表
     *
     * @memberof ChainStore
     */
    @action
    getChains = async () => {
        this.getChainsloading = true
        try {
            const res = await this.api.chain.getChains({ pageIndex: this.pageIndex, pageSize: this.pageSize })
            runInAction('SET_USER_LIST', () => {
                this.chains = res.chains
                this.total = res.total
            })
        } catch (err) {}
        runInAction('HIDE_USER_LIST_LOADING', () => {
            this.getChainsloading = false
        })
    }

    createChain = async (chain: IChainStore.IChain) => {
        await this.api.chain.createChain(chain)
    }

    modifyChain = async (chain: IChainStore.IChain) => {
        await this.api.chain.modifyChain(chain)
    }

    deleteChain = async (_id: string) => {
        await this.api.chain.deleteChain({ _id })
        this.getChains()
    }

    @action
    changePageIndex = (pageIndex: number) => {
        this.pageIndex = pageIndex
        this.getChains()
    }

    @action
    changePageSize = (pageSize: number) => {
        this.pageSize = pageSize
        this.getChains()
    }

    handleTableChange = (pagination: PaginationConfig) => {
        const { current, pageSize } = pagination
        if (current !== this.pageIndex) {
            this.changePageIndex(current)
        }
        if (pageSize !== this.pageSize) {
            this.changePageSize(pageSize)
        }
    }
}

export default new ChainStore()
