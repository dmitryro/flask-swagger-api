import React from 'react'

import styles from './index.scss'
import Header from './Header'
import ChainTable from './ChainTable'
import AutoSizer from '@components/AutoSizer'

export default function Chains() {
    return (
        <div className={styles.container}>
            <Header />
            <AutoSizer className={styles.tableBox}>{({ height }) => <ChainTable scrollY={height - 120} />}</AutoSizer>
        </div>
    )
}
