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
            </Table>
            <ActionModal visible={modalVisible} onCancel={() => setModalVisible(false)} action={currentAction} />
        </React.Fragment>
    )
}

export default observer(ActionTable)
