import React from 'react'
import { Table, Divider, Popconfirm } from 'antd'
import { observer } from 'mobx-react'

import styles from './index.scss'
import { useOnMount } from '@utils/hooks'
import useRootStore from '@store/useRootStore'
import AnalyticModal from './AnalyticModal'

interface IProps {
    scrollY: number
}

function AnalyticTable({ scrollY }: IProps) {
    const { analyticStore } = useRootStore()

    const [modalVisible, setModalVisible] = React.useState(false)
    const [currentAnalytic, setCurrentAnalytic] = React.useState<IAnalyticStore.IAnalytic>(null)

    function modifyAnalytic(analytic: IAnalyticStore.IAnalytic) {
        setCurrentAnalytic(analytic)
        setModalVisible(true)
    }

    useOnMount(analyticStore.getAnalytics)

    return (
        <React.Fragment>
            <Table<IAnalyticStore.IAnalytic>
                className="center-table"
                style={{ width: '100%' }}
                bordered
                rowKey="_id"
                loading={analyticStore.getAnalyticsloading}
                dataSource={analyticStore.analytics}
                scroll={{ y: scrollY }}
                pagination={{
                    current: analyticStore.pageIndex,
                    showSizeChanger: true,
                    pageSize: analyticStore.pageSize,
                    pageSizeOptions: ['30', '20', '10'],
                    total: analyticStore.total
                }}
                onChange={analyticStore.handleTableChange}
            >
            </Table>
            <AnalyticModal visible={modalVisible} onCancel={() => setModalVisible(false)} analytic={currentAnalytic} />
        </React.Fragment>
    )
}

export default observer(AnalyticTable)
