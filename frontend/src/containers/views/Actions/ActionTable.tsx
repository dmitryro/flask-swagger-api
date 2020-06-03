import React from 'react'
import { Table, Divider, Popconfirm } from 'antd'
import { observer } from 'mobx-react'

import styles from './index.scss'
import { useOnMount } from '@utils/hooks'
import useRootStore from '@store/useRootStore'
import ActionModal from './ActionModal'

interface IProps {
    scrollY: number
}

function ActionTable({ scrollY }: IProps) {
    const { actionStore } = useRootStore()

    const [modalVisible, setModalVisible] = React.useState(false)
    const [currentAction, setCurrentAction] = React.useState<IActionStore.IAction>(null)

    function modifyAction(action: IActionStore.IAction) {
        setCurrentAction(action)
        setModalVisible(true)
    }

    useOnMount(actionStore.getActions)

    return (
        <React.Fragment>
            <Table<IActionStore.IAction>
                className="center-table"
                style={{ width: '100%' }}
                bordered
                rowKey="_id"
                loading={actionStore.getActionsloading}
                dataSource={actionStore.actions}
                scroll={{ y: scrollY }}
                pagination={{
                    current: actionStore.pageIndex,
                    showSizeChanger: true,
                    pageSize: actionStore.pageSize,
                    pageSizeOptions: ['30', '20', '10'],
                    total: actionStore.total
                }}
                onChange={actionStore.handleTableChange}
            >
                <Table.Column<IActionStore.IAction> key="id" title="ID" dataIndex="id" width={30} />

                <Table.Column<IActionStore.IAction> key="name" title="Name" dataIndex="name" width={120} />
                <Table.Column<IActionStore.IAction> key="isrunning" title="Is running" dataIndex="isrunning" width={80} />
                <Table.Column<IActionStore.IAction> key="last_run" title="Last run" dataIndex="last_run" width={80} />
                <Table.Column<IActionStore.IAction> key="profile_key" title="Profile Key" dataIndex="profile_key" width={100} />
                <Table.Column<IActionStore.IAction>
                    key="action"
                    title="Action"
                    width={120}
                    render={(_, record) => (
                        <span>
                            <span className={styles.ctrlEle} onClick={() => modifyAction(record)}>
                                Modify
                            </span>
                            <Divider type="vertical" />
                            <Popconfirm
                                placement="top"
                                title="Delete?"
                                onConfirm={() =>ruleStore.deleteAction(record.id)}
                                okText="Yes"
                                cancelText="No">
                                <span className={styles.ctrlEle}>Delete</span>
                            </Popconfirm>
                        </span>
                    )}
                />


            </Table>
            <ActionModal visible={modalVisible} onCancel={() => setModalVisible(false)} action={currentAction} />
        </React.Fragment>
    )
}

export default observer(ActionTable)
