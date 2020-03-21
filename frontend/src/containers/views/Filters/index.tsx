import React from 'react'

import styles from './index.scss'
import Header from './Header'
import FilterTable from './FilterTable'
import AutoSizer from '@components/AutoSizer'

export default function Filters() {
    return (
        <div className={styles.container}>
            <Header />
            <AutoSizer className={styles.tableBox}>{({ height }) => <FilterTable scrollY={height - 120} />}</AutoSizer>
        </div>
    )
}
