import { observable, action, runInAction } from 'mobx'
import { PaginationConfig } from 'antd/lib/pagination'

import { StoreExt } from '@utils/reactExt'

export class AnalyticStore extends StoreExt {
    /**
     * @memberof AnalyticStore
     */
    @observable
    getAnalyticsloading = false
    /**
     * 用户列表
     *
     * @type {IAnalyticStore.IAnalytic[]}
     * @memberof AnalyticStore
     */
    @observable
    analytics: IAnalyticStore.IAnalytic[] = []
    /**
     * table pageIndex
     *
     * @memberof AnalyticStore
     */
    @observable
    pageIndex = 1
    /**
     * table pageSize
     *
     * @memberof AnalyticStore
     */
    @observable
    pageSize = 30
    /**
     * analytics total
     *
     * @memberof AnalyticStore
     */
    @observable
    total = 0

    /**
     * 加载用户列表
     *
     * @memberof AnalyticStore
     */
    @action
    getAnalytics = async () => {
        this.getAnalyticsloading = true
        try {
            const res = await this.api.analytic.getAnalytics({ pageIndex: this.pageIndex, pageSize: this.pageSize })
            runInAction('SET_USER_LIST', () => {
                this.analytics = res.analytics
                this.total = res.total
            })
        } catch (err) {}
        runInAction('HIDE_USER_LIST_LOADING', () => {
            this.getAnalyticsloading = false
        })
    }

    createAnalytic = async (analytic: IAnalyticStore.IAnalytic) => {
        await this.api.analytic.createAnalytic(analytic)
    }

    modifyAnalytic = async (analytic: IAnalyticStore.IAnalytic) => {
        await this.api.analytic.modifyAnalytic(analytic)
    }

    deleteAnalytic = async (_id: string) => {
        await this.api.analytic.deleteAnalytic({ _id })
        this.getAnalytics()
    }

    @action
    changePageIndex = (pageIndex: number) => {
        this.pageIndex = pageIndex
        this.getAnalytics()
    }

    @action
    changePageSize = (pageSize: number) => {
        this.pageSize = pageSize
        this.getAnalytics()
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

export default new AnalyticStore()
