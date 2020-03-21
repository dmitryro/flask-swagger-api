import React from 'react'
import { Button } from 'antd'

import styles from './index.scss'
import MetricModal from './../MetricModal'

function Header() {
    const [modalVisible, setModalVisible] = React.useState(false)

    function toggleModalVisible() {
        setModalVisible(visible => !visible)
    }

    return (
        <div className={styles.header}>
            <Button type="primary" onClick={toggleModalVisible}>
                add metric
            </Button>
            <MetricModal visible={modalVisible} onCancel={toggleModalVisible} />
        </div>
    )
}

export default Header
