import React from 'react'
import { Button } from 'antd'

import styles from './index.scss'
import RuleModal from './../RuleModal'

function Header() {
    const [modalVisible, setModalVisible] = React.useState(false)

    function toggleModalVisible() {
        setModalVisible(visible => !visible)
    }

    return (
        <div className={styles.header}>
            <Button type="primary" onClick={toggleModalVisible}>
                add rule
            </Button>
            <RuleModal visible={modalVisible} onCancel={toggleModalVisible} />
        </div>
    )
}

export default Header
