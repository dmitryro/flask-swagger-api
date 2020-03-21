import React from 'react'
import { Table, Divider, Popconfirm } from 'antd'
import { observer } from 'mobx-react'

import styles from './index.scss'
import { useOnMount } from '@utils/hooks'
import useRootStore from '@store/useRootStore'
import MetricModal from './MetricModal'

interface IProps {
    scrollY: number
}

function MetricTable({ scrollY }: IProps) {
    const { metricStore } = useRootStore()

    const [modalVisible, setModalVisible] = React.useState(false)
    const [currentMetric, setCurrentMetric] = React.useState<IMetricStore.IMetric>(null)

    function modifyMetric(metric: IMetricStore.IMetric) {
        setCurrentMetric(metric)
        setModalVisible(true)
    }


    return (
        <React.Fragment>
        </React.Fragment>
    )
}

export default observer(MetricTable)
