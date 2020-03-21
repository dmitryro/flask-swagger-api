import React from 'react'
import { Table, Divider, Popconfirm } from 'antd'
import { observer } from 'mobx-react'

import styles from './index.scss'
import { useOnMount } from '@utils/hooks'
import useRootStore from '@store/useRootStore'
import SiteModal from './SiteModal'

interface IProps {
    scrollY: number
}

function SiteTable({ scrollY }: IProps) {
    const { siteStore } = useRootStore()

    const [modalVisible, setModalVisible] = React.useState(false)
    const [currentSite, setCurrentSite] = React.useState<ISiteStore.ISite>(null)

    function modifySite(site: ISiteStore.ISite) {
        setCurrentSite(site)
        setModalVisible(true)
    }

    useOnMount(siteStore.getSites)

    return (
        <React.Fragment>
            <Table<ISiteStore.ISite>
                className="center-table"
                style={{ width: '100%' }}
                bordered
                rowKey="_id"
                loading={siteStore.getSitesloading}
                dataSource={siteStore.sites}
                scroll={{ y: scrollY }}
                pagination={{
                    current: siteStore.pageIndex,
                    showSizeChanger: true,
                    pageSize: siteStore.pageSize,
                    pageSizeOptions: ['30', '20', '10'],
                    total: siteStore.total
                }}
                onChange={siteStore.handleTableChange}
            >
                <Table.Column<ISiteStore.ISite> key="account" title="Account" dataIndex="account" width={200} />
                <Table.Column<ISiteStore.ISite> key="category" title="Category" dataIndex="category" width={100} />
                <Table.Column<ISiteStore.ISite> key="createdAt" title="CreatedAt" dataIndex="createdAt" width={200} />
                <Table.Column<ISiteStore.ISite>
                    key="action"
                    title="Action"
                    width={120}
                    render={(_, record) => (
                        <span>
                            <span className={styles.ctrlEle} onClick={() => modifySite(record)}>
                                Modify
                            </span>
                            <Divider type="vertical" />
                            <Popconfirm
                                placement="top"
                                title="确认删除?"
                                onConfirm={() => siteStore.deleteSite(record._id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <span className={styles.ctrlEle}>Delete</span>
                            </Popconfirm>
                        </span>
                    )}
                />
            </Table>
            <SiteModal visible={modalVisible} onCancel={() => setModalVisible(false)} site={currentSite} />
        </React.Fragment>
    )
}

export default observer(SiteTable)
