import React from 'react'

import styles from './index.scss'
import Header from './Header'
import SiteTable from './SiteTable'
import AutoSizer from '@components/AutoSizer'

export default function Sites() {
    return (
        <div className={styles.container}>
            <Header />
            <AutoSizer className={styles.tableBox}>{({ height }) => <SiteTable scrollY={height - 120} />}</AutoSizer>
        </div>
    )
}
