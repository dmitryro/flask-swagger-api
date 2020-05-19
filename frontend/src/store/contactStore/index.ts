import { observable, action, runInAction } from 'mobx'
import { PaginationConfig } from 'antd/lib/pagination'

import { StoreExt } from '@utils/reactExt'

export class ContactStore extends StoreExt {
    /**
     * 加载用户列表时的loading
     *
     * @memberof ContactStore
     */
    @observable
    getContactsloading = false
    /**
     * 用户列表
     *
     * @type {IContactStore.IContact[]}
     * @memberof ContactStore
     */
    @observable
    contacts: IContactStore.IContact[] = []
    /**
     * table pageIndex
     *
     * @memberof ContactStore
     */
    @observable
    pageIndex = 1
    /**
     * table pageSize
     *
     * @memberof ContactStore
     */
    @observable
    pageSize = 30
    /**
     * contacts total
     *
     * @memberof ContactStore
     */
    @observable
    total = 0

    /**
     * 加载用户列表
     *
     * @memberof ContactStore
     */
    @action
    getContacts = async () => {
        this.getContactsloading = true
        try {
            const res = await this.api.contact.getContacts({ pageIndex: this.pageIndex, pageSize: this.pageSize })
            runInAction('SET_USER_LIST', () => {
                this.contacts = res.contacts
                this.total = res.total
            })
        } catch (err) {}
        runInAction('HIDE_USER_LIST_LOADING', () => {
            this.getContactsloading = false
        })
    }

    createContact = async (contact: IContactStore.IContact) => {
        await this.api.contact.createContact(contact)
    }

    modifyContact = async (contact: IContactStore.IContact) => {
        await this.api.contact.modifyContact(contact)
    }

    deleteContact = async (_id: string) => {
        await this.api.contact.deleteContact({ _id })
        this.getContacts()
    }

    @action
    changePageIndex = (pageIndex: number) => {
        this.pageIndex = pageIndex
        this.getContacts()
    }

    @action
    changePageSize = (pageSize: number) => {
        this.pageSize = pageSize
        this.getContacts()
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

export default new ContactStore()
