import React from 'react'

import styles from './index.scss'
import Header from './Header'
import RuleTable from './RuleTable'
import AutoSizer from '@components/AutoSizer'

export default function Rules() {
    return (
        <div className={styles.container}>
            <Header />
            <AutoSizer className={styles.tableBox}>{({ height }) => <RuleTable scrollY={height - 120} />}</AutoSizer>
        </div>
    )
}
