import React from 'react'

import styles from './index.scss'
import Header from './Header'
import LogTable from './LogTable'
import AutoSizer from '@components/AutoSizer'

export default function Logs() {
    return (
        <div className={styles.container}>
            <Header />
            <AutoSizer className={styles.tableBox}>{({ height }) => <LogTable scrollY={height - 120} />}</AutoSizer>
        </div>
    )
}
