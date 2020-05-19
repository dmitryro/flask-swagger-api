import React from 'react'
import { Button } from 'antd'

import styles from './index.scss'
import EventModal from './../EventModal'

function Header() {
    const [modalVisible, setModalVisible] = React.useState(false)

    function toggleModalVisible() {
        setModalVisible(visible => !visible)
    }

    return (
        <div className={styles.header}>
            <Button type="primary" onClick={toggleModalVisible}>
                add event
            </Button>
            <EventModal visible={modalVisible} onCancel={toggleModalVisible} />
        </div>
    )
}

export default Header
