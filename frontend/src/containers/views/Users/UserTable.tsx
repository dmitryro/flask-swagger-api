import React from 'react'
import { Table, Divider, Popconfirm } from 'antd'
import { observer } from 'mobx-react'

import styles from './index.scss'
import { useOnMount } from '@utils/hooks'
import useRootStore from '@store/useRootStore'
import UserModal from './UserModal'

interface IProps {
    scrollY: number
}

function UserTable({ scrollY }: IProps) {
    const { userStore } = useRootStore()

    const [modalVisible, setModalVisible] = React.useState(false)
    const [currentUser, setCurrentUser] = React.useState<IUserStore.IUser>(null)

    function modifyUser(user: IUserStore.IUser) {
        setCurrentUser(user)
        setModalVisible(true)
    }

    useOnMount(userStore.getUsers)

    return (
        <React.Fragment>
            <Table<IUserStore.IUser>
                className="center-table"
                style={{ width: '100%' }}
                bordered
                rowKey="id"
                loading={userStore.getUsersloading}
                dataSource={userStore.users}
                scroll={{ y: scrollY }}
                pagination={{
                    current: userStore.pageIndex || 0,
                    showSizeChanger: true,
                    pageSize: userStore.pageSize,
                    pageSizeOptions: ['30', '20', '10'],
                    total: userStore.total
                }}
                onChange={userStore.handleTableChange}
            >
                <Table.Column<IUserStore.IUser> key="id" title="id" dataIndex="id" width={30} />
                <Table.Column<IUserStore.IUser> key="username" title="Username" dataIndex="username" width={100} />
                <Table.Column<IUserStore.IUser> key="first_name" title="First" dataIndex="first_name" width={120} />
                <Table.Column<IUserStore.IUser> key="last_name" title="Last" dataIndex="last_name" width={120} />
                <Table.Column<IUserStore.IUser> key="date_joined" title="Date Joined" dataIndex="date_joined" width={120} />
                <Table.Column<IUserStore.IUser> key="last_login" title="Last Login" dataIndex="last_login" width={120} />
                <Table.Column<IUserStore.IUser>
                    key="action"
                    title="Action"
                    width={120}
                    render={(_, record) => (
                        <span>
                            <span className={styles.ctrlEle} onClick={() => modifyUser(record)}>
                                Modify
                            </span>
                            <Divider type="vertical" />
                            <Popconfirm
                                placement="top"
                                title="Delete?"
                                onConfirm={() => userStore.deleteUser(record.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <span className={styles.ctrlEle}>Delete</span>
                            </Popconfirm>
                        </span>
                    )}
                />
            </Table>
            <UserModal visible={modalVisible} onCancel={() => setModalVisible(false)} user={currentUser} />
        </React.Fragment>
    )
}

export default observer(UserTable)
