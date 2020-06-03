import { observable, action, runInAction } from 'mobx'
import { PaginationConfig } from 'antd/lib/pagination'

import { StoreExt } from '@utils/reactExt'

export class ActionStore extends StoreExt {
    /**
     * 加载用户列表时的loading
     *
     * @memberof ActionStore
     */
    @observable
    getActionsloading = false
    /**
     * 用户列表
     *
     * @type {IActionStore.IAction[]}
     * @memberof ActionStore
     */
    @observable
    actions: IActionStore.IAction[] = []
    /**
     * table pageIndex
     *
     * @memberof ActionStore
     */
    @observable
    pageIndex = 1
    /**
     * table pageSize
     *
     * @memberof ActionStore
     */
    @observable
    pageSize = 30
    /**
     * actions total
     *
     * @memberof ActionStore
     */
    @observable
    total = 0

    /**
     * 加载用户列表
     *
     * @memberof ActionStore
     */
    @action
    getActions = async () => {
        this.getActionsloading = true
        try {
            const res = await this.api.action.getActions({ pageIndex: this.pageIndex, pageSize: this.pageSize })
            runInAction('SET_ACTION_LIST', () => {
                this.actions = res.data;
                this.total = res.data.length;
            })
        } catch (err) {}
        runInAction('HIDE_ACTION_LIST_LOADING', () => {
            this.getActionsloading = false
        })
    }

    createAction = async (action: IActionStore.IAction) => {
        await this.api.action.createAction(action)
    }

    modifyAction = async (action: IActionStore.IAction) => {
        await this.api.action.modifyAction(action)
    }

    deleteAction = async (_id: string) => {
        await this.api.action.deleteAction({ _id })
        this.getActions()
    }

    @action
    changePageIndex = (pageIndex: number) => {
        this.pageIndex = pageIndex
        this.getActions()
    }

    @action
    changePageSize = (pageSize: number) => {
        this.pageSize = pageSize
        this.getActions()
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

export default new ActionStore()
