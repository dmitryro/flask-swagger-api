import { observable, action, runInAction } from 'mobx'
import { PaginationConfig } from 'antd/lib/pagination'

import { StoreExt } from '@utils/reactExt'

export class LogStore extends StoreExt {
    /**
     * @memberof LogStore
     */

    @observable
    toggledClearRows = false

    @observable
    component = undefined

    @observable
    forceUpdate = undefined

    @observable
    getLogsloading = false

    @observable
    selectedRows = []

    @observable
    selected: number[] = []

    @observable
    deleted: number[] = []


    @observable
    data = []

    /**
     * 用户列表
     *
     * @type {ILogStore.ILog[]}
     * @memberof LogStore
     */
    @observable
    logs: ILogStore.ILog[] = []
    /**
     * table pageIndex
     *
     * @memberof LogStore
     */
    @observable
    pageIndex = 1


    /**
     * table pageSize
     *
     * @memberof LogStore
     */
    @observable
    pageSize = 30
    /**
     * logs total
     *
     * @memberof LogStore
     */
    @observable
    total = 0

    @action
    setSelectedRows = async (selectedRows) => {
        this.selectedRows = selectedRows;
    }

    @action
    setToggledClearRows = (toggledClearRows)=> {
        this.toggledClearRows = toggledClearRows;
    }


    @action
    getToggledClearRows = ()=> {
        return this.toggledClearRows;
    }
    /**
     * 加载用户列表
     *
     * @memberof LogStore
     */
    @action
    getLogs = async () => {
        this.getLogsloading = true
        try {
             console.log("Trying to fetch logs ..."+JSON.stringify(this.api));
             var res = await this.api.log.getLogs({ pageIndex: this.pageIndex, pageSize: this.pageSize  });
              
             runInAction('SET_LOG_LIST', () => {
                this.logs = res.data
                this.total = this.logs.length
            })

        } catch (err) {
            console.log("Failed fetching logs ..."+err);
        }
        runInAction('HIDE_LOG_LIST_LOADING', () => {
            this.getLogsloading = false
        })
    }

    @action
    pushLog = async(id: number) => {   
         if(!this.selected.includes(id)) {
             this.selected.push(id);
         }
    }
    @action
    setLogs = async(logs: Array) => {
         this.logs = logs;
    }

    @action
    pushDeleted = async(id: number) => {
         if(!this.deleted.includes(id)) {
             this.deleted.push(id);
         }
    }

    @action
    popFromDeleted = async(id: number) => {
       if(this.deleted.includes(id)) {
           const index = this.deleted.indexOf(id);
           if (index > -1) {
               this.deleted.splice(index, 1);
           }
       }
    }

    @action
    popFromLogs = async(id: number) => {
        for(var i=0; i<this.logs.length;i++) {
            if(eval(this.logs[i].id)===id) {
                this.logs.splice(i, 1);
            }
        }
    }

    @action
    popFromSelected = async(id: number) => {
         if(this.selected.includes(id)) {
             const index = this.selected.indexOf(id);
             if (index > -1) {
                  this.selected.splice(index, 1);
             }
         }
    }

    @action
    refreshLogs = async() => {
        if (this.logs.length > 0) {
            for(var i=0; i<this.logs.length; i++) {
                if (this.deleted.includes(this.logs[i].id)) {
                    this.logs.splice(i, 1);
                }
            }
        }
    }

    createLog = async (log: ILogStore.ILog) => {
        var res = await this.api.log.createLog(log)  
        runInAction('SET_LOG_LIST', () => {
                             this.logs = res.data
                             this.total = 2
                         
        });
    }

    modifyLog = async (log: ILogStore.ILog) => {
        await this.api.log.modifyLog(log)
    }

    deleteLog = async (id) => {
        var res = await this.api.log.deleteLog(id)
        this.getLogs();
    }


    deleteSelected = async() => {
            var rows = this.selectedRows;
            if (rows) {
                for(var i=0; i<rows.length; i++) {
                    this.api.log.deleteLog(rows[i].id);
                }
            }
            this.selectedRow = [];
    }

    @action
    changePageIndex = (pageIndex: number) => {
        this.pageIndex = pageIndex
        this.getLogs()
    }
 
    @action
    emptySelected = () => {
        this.selected = []
    }    

    @action
    emptyDeleted = () => {
        //this.deleted = []
    }

    @action
    changePageSize = (pageSize: number) => {
        this.pageSize = pageSize
        this.getLogs()
    }

    @action
    setData = (data) => {
        this.data = data
    }

    @action
    setTotal = (total: number) => {
        this.total = total
    }



    @action
    toggleUpdate = () => {
       console.log("Time to update ... ");
    }

    @action
    setForceUpdate = (forceUpdate) => {
       this.forceUpdate = forceUpdate
    }

    @action
    setComponent = (component) => {
       this.component = component
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

export default new LogStore()
