import React from 'react'

import styles from './index.scss'
import Header from './Header'
import ContactTable from './ContactTable'
import AutoSizer from '@components/AutoSizer'

export default function Contacts() {
    return (
        <div className={styles.container}>
            <Header />
            <AutoSizer className={styles.tableBox}>{({ height }) => <ContactTable scrollY={height - 120} />}</AutoSizer>
        </div>
    )
}
