import React from 'react'

import styles from './index.scss'
import Header from './Header'
import SettingTable from './SettingTable'
import AutoSizer from '@components/AutoSizer'

export default function Settings() {
    return (
        <div className={styles.container}>
            <Header />
            <AutoSizer className={styles.tableBox}>{({ height }) => <SettingTable scrollY={height - 120} />}</AutoSizer>
        </div>
    )
}
