import React from 'react'

import styles from './index.scss'
import Header from './Header'
import TaskTable from './TaskTable'
import AutoSizer from '@components/AutoSizer'

export default function Tasks() {
    return (
        <div className={styles.container}>
            <Header />
            <AutoSizer className={styles.tableBox}>{({ height }) => <TaskTable scrollY={height - 120} />}</AutoSizer>
        </div>
    )
}
