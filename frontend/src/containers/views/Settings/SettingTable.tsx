import React from 'react'
import { Table, Divider, Popconfirm } from 'antd'
import { observer } from 'mobx-react'

import styles from './index.scss'
import { useOnMount } from '@utils/hooks'
import useRootStore from '@store/useRootStore'
import SettingModal from './SettingModal'

interface IProps {
    scrollY: number
}

function SettingTable({ scrollY }: IProps) {
    const { settingStore } = useRootStore()

    const [modalVisible, setModalVisible] = React.useState(false)
    const [currentSetting, setCurrentSetting] = React.useState<ISettingStore.ISetting>(null)

    function modifySetting(setting: ISettingStore.ISetting) {
        setCurrentSetting(setting)
        setModalVisible(true)
    }

    //useOnMount(settingStore.getSettings)

    return (
        <React.Fragment>
        </React.Fragment>
    )
}

export default observer(SettingTable)
