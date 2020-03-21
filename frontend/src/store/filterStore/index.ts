import { observable, action, runInAction } from 'mobx'
import { PaginationConfig } from 'antd/lib/pagination'

import { StoreExt } from '@utils/reactExt'

export class FilterStore extends StoreExt {
    /**
     * 加载用户列表时的loading
     *
     * @memberof FilterStore
     */
    @observable
    getFiltersloading = false
    /**
     * 用户列表
     *
     * @type {IFilterStore.IFilter[]}
     * @memberof FilterStore
     */
    @observable
    filters: IFilterStore.IFilter[] = []
    /**
     * table pageIndex
     *
     * @memberof FilterStore
     */
    @observable
    pageIndex = 1
    /**
     * table pageSize
     *
     * @memberof FilterStore
     */
    @observable
    pageSize = 30
    /**
     * filters total
     *
     * @memberof FilterStore
     */
    @observable
    total = 0

    /**
     * 加载用户列表
     *
     * @memberof FilterStore
     */
    @action
    getFilters = async () => {
        this.getFiltersloading = true
        try {
            const res = await this.api.filter.getFilters({ pageIndex: this.pageIndex, pageSize: this.pageSize })
            runInAction('SET_USER_LIST', () => {
                this.filters = res.filters
                this.total = res.total
            })
        } catch (err) {}
        runInAction('HIDE_USER_LIST_LOADING', () => {
            this.getFiltersloading = false
        })
    }

    createFilter = async (filter: IFilterStore.IFilter) => {
        await this.api.filter.createFilter(filter)
    }

    modifyFilter = async (filter: IFilterStore.IFilter) => {
        await this.api.filter.modifyFilter(filter)
    }

    deleteFilter = async (_id: string) => {
        await this.api.filter.deleteFilter({ _id })
        this.getFilters()
    }

    @action
    changePageIndex = (pageIndex: number) => {
        this.pageIndex = pageIndex
        this.getFilters()
    }

    @action
    changePageSize = (pageSize: number) => {
        this.pageSize = pageSize
        this.getFilters()
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

export default new FilterStore()
