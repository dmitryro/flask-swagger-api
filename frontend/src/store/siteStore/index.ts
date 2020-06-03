import { observable, decorate,  action, autorun, runInAction } from 'mobx'
import { PaginationConfig } from 'antd/lib/pagination'

import { StoreExt } from '@utils/reactExt'

export class SiteStore extends StoreExt {
   @observable
   crawlingProgress = 0

   @observable
   crawlingResult = undefined

   @observable
   isCrawling = false

   @observable
   site_id = -1


   @action
   setIsCrawling = (isCrawling) => {
       this.isCrawling = isCrawling;
   }

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
G     * @memberof SiteStore
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
        this.crawlingProgress = 0;
        this.crawlingResult = undefined;
        //var res = await 
        this.api.site.crawlSite(id).then(result => {
               this.crawlingResult = JSON.stringify(result);
               this.isCrawling = false;
               this.crawlingProgress = 100;
        });
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

decorate(SiteStore, {
  crawlingtProgress: observable,
  setConvertProgress: action
});

export default new SiteStore()
