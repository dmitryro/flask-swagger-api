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

    useOnMount(settingStore.getSettings)

    return (
        <React.Fragment>
            <Table<ISettingStore.ISetting>
                className="center-table"
                style={{ width: '100%' }}
                bordered
                rowKey="_id"
                loading={settingStore.getSettingsloading}
                dataSource={settingStore.settings}
                scroll={{ y: scrollY }}
                pagination={{
                    current: settingStore.pageIndex,
                    showSizeChanger: true,
                    pageSize: settingStore.pageSize,
                    pageSizeOptions: ['30', '20', '10'],
                    total: settingStore.total
                }}
                onChange={settingStore.handleTableChange}
            >
            </Table>
            <SettingModal visible={modalVisible} onCancel={() => setModalVisible(false)} setting={currentSetting} />
        </React.Fragment>
    )
}

export default observer(SettingTable)
