import React from 'react'

import styles from './index.scss'
import Header from './Header'
import AnalyticTable from './AnalyticTable'
import AutoSizer from '@components/AutoSizer'

export default function Analytics() {
    return (
        <div className={styles.container}>
            <Header />
            <AutoSizer className={styles.tableBox}>{({ height }) => <AnalyticTable scrollY={height - 120} />}</AutoSizer>
        </div>
    )
}
