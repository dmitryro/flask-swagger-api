import React from 'react'
import { Table, Divider, Popconfirm } from 'antd'
import { observer } from 'mobx-react'

import styles from './index.scss'
import { useOnMount } from '@utils/hooks'
import useRootStore from '@store/useRootStore'
import ContactModal from './ContactModal'

interface IProps {
    scrollY: number
}

function ContactTable({ scrollY }: IProps) {
    const { contactStore } = useRootStore()

    const [modalVisible, setModalVisible] = React.useState(false)
    const [currentContact, setCurrentContact] = React.useState<IContactStore.IContact>(null)

    function modifyContact(contact: IContactStore.IContact) {
        setCurrentContact(contact)
        setModalVisible(true)
    }

    useOnMount(contactStore.getContacts)

    return (
        <React.Fragment>
            <Table<IContactStore.IContact>
                className="center-table"
                style={{ width: '100%' }}
                bordered
                rowKey="_id"
                loading={contactStore.getContactsloading}
                dataSource={contactStore.contacts}
                scroll={{ y: scrollY }}
                pagination={{
                    current: contactStore.pageIndex,
                    showSizeChanger: true,
                    pageSize: contactStore.pageSize,
                    pageSizeOptions: ['30', '20', '10'],
                    total: contactStore.total
                }}
                onChange={contactStore.handleTableChange}
            >
            </Table>
            <ContactModal visible={modalVisible} onCancel={() => setModalVisible(false)} contact={currentContact} />
        </React.Fragment>
    )
}

export default observer(ContactTable)
