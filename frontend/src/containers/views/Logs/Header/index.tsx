import React from 'react'
import { Button } from 'antd'

import styles from './index.scss'
import LogModal from './../LogModal'

function Header() {
    const [modalVisible, setModalVisible] = React.useState(false)

    function toggleModalVisible() {
        setModalVisible(visible => !visible)
    }

    return (
        <div className={styles.header}>
            <Button type="primary" onClick={toggleModalVisible}>
                delete logs
            </Button>
            <LogModal visible={modalVisible} onCancel={toggleModalVisible} />
        </div>
    )
}

export default Header
