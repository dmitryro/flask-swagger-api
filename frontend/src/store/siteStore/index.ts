import { observable, action, runInAction } from 'mobx'
import { PaginationConfig } from 'antd/lib/pagination'

import { StoreExt } from '@utils/reactExt'

export class SiteStore extends StoreExt {
    /**
     * 加载用户列表时的loading
     *
     * @memberof SiteStore
     */
    @observable
    getSitesloading = false
    /**
     * 用户列表
     *
     * @type {ISiteStore.ISite[]}
     * @memberof SiteStore
     */
    @observable
    sites: ISiteStore.ISite[] = []
    /**
     * table pageIndex
     *
     * @memberof SiteStore
     */
    @observable
    pageIndex = 1
    /**
     * table pageSize
     *
     * @memberof SiteStore
     */
    @observable
    pageSize = 30
    /**
     * sites total
     *
     * @memberof SiteStore
     */
    @observable
    total = 0

    /**
     * 加载用户列表
     *
     * @memberof SiteStore
     */
    @action
    getSites = async () => {
        this.getSitesloading = true
        try {
            const res = await this.api.site.getSites({ pageIndex: this.pageIndex, pageSize: this.pageSize })
            runInAction('SET_USER_LIST', () => {
                this.sites = res.sites
                this.total = res.total
            })
        } catch (err) {}
        runInAction('HIDE_USER_LIST_LOADING', () => {
            this.getSitesloading = false
        })
    }

    createSite = async (site: ISiteStore.ISite) => {
        await this.api.site.createSite(site)
    }

    modifySite = async (site: ISiteStore.ISite) => {
        await this.api.site.modifySite(site)
    }

    deleteSite = async (_id: string) => {
        await this.api.site.deleteSite({ _id })
        this.getSites()
    }

    @action
    changePageIndex = (pageIndex: number) => {
        this.pageIndex = pageIndex
        this.getSites()
    }

    @action
    changePageSize = (pageSize: number) => {
        this.pageSize = pageSize
        this.getSites()
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

export default new SiteStore()
