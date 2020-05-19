import React from 'react'

import styles from './index.scss'
import Header from './Header'
import EventTable from './EventTable'
import AutoSizer from '@components/AutoSizer'

export default function Events() {
    return (
        <div className={styles.container}>
            <Header />
            <AutoSizer className={styles.tableBox}>{({ height }) => <EventTable scrollY={height - 120} />}</AutoSizer>
        </div>
    )
}
