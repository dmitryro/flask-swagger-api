import React from 'react'
import { Table, Divider, Popconfirm } from 'antd'
import { observer } from 'mobx-react'

import styles from './index.scss'
import { useOnMount } from '@utils/hooks'
import useRootStore from '@store/useRootStore'

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


    return (
        <React.Fragment>
        </React.Fragment>
    )
}

export default observer(ActionTable)
