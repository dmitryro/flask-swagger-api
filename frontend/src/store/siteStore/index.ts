import { observable, action, autorun, runInAction } from 'mobx'
import { PaginationConfig } from 'antd/lib/pagination'

import { StoreExt } from '@utils/reactExt'

export class SiteStore extends StoreExt {
    /**
     * @memberof SiteStore
     */
    @observable
    getSitesloading = false
    /**
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
     * @memberof SiteStore
     */
    @action
    getSites = async () => {
        this.getSitesloading = true
        try {
            var res = await this.api.site.getSites({ pageIndex: this.pageIndex, pageSize: this.pageSize });
            
            runInAction('SET_SITE_LIST', () => {
                                     this.sites = res.data
                                     this.total = 2
                                 
            })
        } catch (err) {}
        runInAction('HIDE_SITE_LIST_LOADING', () => {
            this.getSitesloading = false
        })
    }

    createSite = async (site: ISiteStore.ISite) => {
        var res = await this.api.site.createSite(site)
        runInAction('SET_SITE_LIST', () => {
                                          this.sites = res.data
                                          this.total = 2
             
                     
        });
    }

    modifySite = async (site: ISiteStore.ISite) => {
        await this.api.site.modifySite(site)
    }

    deleteSite = async (id) => {
        var res = await this.api.site.deleteSite(id) 
        this.getSites();
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
