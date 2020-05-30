import { observable, action, runInAction } from 'mobx'
import { PaginationConfig } from 'antd/lib/pagination'

import { StoreExt } from '@utils/reactExt'

export class RuleStore extends StoreExt {
    /**
     * 加载用户列表时的loading
     *
     * @memberof RuleStore
     */
    @observable
    getRulesloading = false
    /**
     * 用户列表
     *
     * @type {IRuleStore.IRule[]}
     * @memberof RuleStore
     */
    @observable
    rules: IRuleStore.IRule[] = []
    /**
     * table pageIndex
     *
     * @memberof RuleStore
     */
    @observable
    pageIndex = 1
    /**
     * table pageSize
     *
     * @memberof RuleStore
     */
    @observable
    pageSize = 30
    /**
     * rules total
     *
     * @memberof RuleStore
     */
    @observable
    total = 0

    /**
     * 加载用户列表
     *
     * @memberof RuleStore
     */
    @action
    getRules = async () => {
        this.getRulesloading = true
        try {
            const res = await this.api.rule.getRules({ pageIndex: this.pageIndex, pageSize: this.pageSize })
            runInAction('SET_USER_LIST', () => {
                this.rules = res.rules
                this.total = res.total
            })
        } catch (err) {}
        runInAction('HIDE_USER_LIST_LOADING', () => {
            this.getRulesloading = false
        })
    }

    createRule = async (rule: IRuleStore.IRule) => {
        await this.api.rule.createRule(rule)
    }

    modifyRule = async (rule: IRuleStore.IRule) => {
        await this.api.rule.modifyRule(rule)
    }

    deleteRule = async (_id: string) => {
        await this.api.rule.deleteRule({ _id })
        this.getRules()
    }

    @action
    changePageIndex = (pageIndex: number) => {
        this.pageIndex = pageIndex
        this.getRules()
    }

    @action
    changePageSize = (pageSize: number) => {
        this.pageSize = pageSize
        this.getRules()
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

export default new RuleStore()