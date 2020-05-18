import { observable, action, autorun, runInAction } from 'mobx'
import { PaginationConfig } from 'antd/lib/pagination'

import { StoreExt } from '@utils/reactExt'

export class SiteStore extends StoreExt {
   @observable
   crawlingProgress = 15

   @observable
   isCrawling = false

   @observable
   site_id = -1
   /**
    * Increase progress bar
    */
   @action
   setCrawlingProgress = progress => {
      if (this.crawlingProgress < 100) {
          this.crawlingProgress = progress;
      } else {
          this.crawlingProgress = 0;
          this.isCrawling = false;
      }
   };

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
        this.getSites();
    }

    @action
    crawlSite = async (id) => {
        this.isCrawling = true;
        this.site_id = id;
       // this.crawlingProgress = 0;
        //this.setCrawlingProgress = 0;

        var res = await this.api.site.crawlSite(id);
        //if (this.crawlingProgress == 100) {
        //     this.isCrawling = false;
        //     this.crawlingProgress = 0;
        //}
        setTimeout(function () {
                  this.setCrawlingProgres s= this.crawlingProgress + 10; 
        }, 3000);
        this.getSites();
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
