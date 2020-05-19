import { observable, action, runInAction } from 'mobx'
import { PaginationConfig } from 'antd/lib/pagination'

import { StoreExt } from '@utils/reactExt'

export class EventStore extends StoreExt {
    /**
     * @memberof EventStore
     */
    @observable
    getEventsloading = false
    /**
     * 用户列表
     *
     * @type {IEventStore.IEvent[]}
     * @memberof EventStore
     */
    @observable
    events: IEventStore.IEvent[] = []
    /**
     * table pageIndex
     *
     * @memberof EventStore
     */
    @observable
    pageIndex = 1
    /**
     * table pageSize
     *
     * @memberof EventStore
     */
    @observable
    pageSize = 30
    /**
     * events total
     *
     * @memberof EventStore
     */
    @observable
    total = 0

    /**
     * 加载用户列表
     *
     * @memberof EventStore
     */
    @action
    getEvents = async () => {
        this.getEventsloading = true
        try {
             var res = await this.api.event.getEvents({ pageIndex: this.pageIndex, pageSize: this.pageSize  });
             
            runInAction('SET_USER_LIST', () => {
                this.events = res.data
                this.total = 2
            })

        } catch (err) {}
        runInAction('HIDE_USER_LIST_LOADING', () => {
            this.getEventsloading = false
        })
    }
    
    createEvent = async (event: IEventStore.IEvent) => {
        var res = await this.api.event.createEvent(event)  
        runInAction('SET_USER_LIST', () => {
                             this.events = res.data
                             this.total = 2
                         
        });
    }

    modifyEvent = async (event: IEventStore.IEvent) => {
        await this.api.event.modifyEvent(event)
    }

    deleteEvent = async (id) => {
        var res = await this.api.event.deleteEvent(id)
        this.getEvents();
    }

    @action
    changePageIndex = (pageIndex: number) => {
        this.pageIndex = pageIndex
        this.getEvents()
    }

    @action
    changePageSize = (pageSize: number) => {
        this.pageSize = pageSize
        this.getEvents()
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

export default new EventStore()
