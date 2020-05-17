import React from 'react'
import { Divider, Table, Popconfirm } from 'antd'
import styles from './index.scss'
import useRootStore from '@store/useRootStore'

function modifySite(site: ISiteStore.ISite) {
    setCurrentSite(site)
    setModalVisible(true)
}

function SiteAction({record}) {
    const [modalVisible, setModalVisible] = React.useState(false)
    const [currentSite, setCurrentSite] = React.useState<ISiteStore.ISite>(null)
    const { siteStore } = useRootStore()
    return (
        <span>
            <span className={styles.ctrlEle} onClick={() => siteStore.crawlSite(record.id)}>
            Crawl
            </span>
            <Divider type="vertical" />
            <span className={styles.ctrlEle} onClick={() => modifySite(record)}>
            Modify
            </span>
            <Divider type="vertical" />
            <Popconfirm
             placement="top"
             title="Delete?"
             onConfirm={() => siteStore.deleteSite(record.id)}
             okText="Yes"
             cancelText="No">
                <span className={styles.ctrlEle}>Delete</span>
            </Popconfirm>
        </span>
    )
}

export default SiteAction
