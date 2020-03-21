import React from 'react'
import { Table, Divider, Popconfirm } from 'antd'
import { observer } from 'mobx-react'

import styles from './index.scss'
import { useOnMount } from '@utils/hooks'
import useRootStore from '@store/useRootStore'
import TaskModal from './TaskModal'

interface IProps {
    scrollY: number
}

function TaskTable({ scrollY }: IProps) {
    const { taskStore } = useRootStore()

    const [modalVisible, setModalVisible] = React.useState(false)
    const [currentTask, setCurrentTask] = React.useState<ITaskStore.ITask>(null)

    function modifyTask(task: ITaskStore.ITask) {
        setCurrentTask(task)
        setModalVisible(true)
    }


    return (
        <React.Fragment>
        </React.Fragment>
    )
}

export default observer(TaskTable)
