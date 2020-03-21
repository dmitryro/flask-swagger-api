import React from 'react'

import styles from './index.scss'
import Header from './Header'
import ActionTable from './ActionTable'
import AutoSizer from '@components/AutoSizer'

export default function Actions() {
    return (
        <div className={styles.container}>
            <Header />
            <AutoSizer className={styles.tableBox}>{({ height }) => <ActionTable scrollY={height - 120} />}</AutoSizer>
        </div>
    )
}
