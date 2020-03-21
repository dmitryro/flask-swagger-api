import React from 'react'

import styles from './index.scss'
import Header from './Header'
import MetricTable from './MetricTable'
import AutoSizer from '@components/AutoSizer'

export default function Metrics() {
    return (
        <div className={styles.container}>
            <Header />
            <AutoSizer className={styles.tableBox}>{({ height }) => <MetricTable scrollY={height - 120} />}</AutoSizer>
        </div>
    )
}
