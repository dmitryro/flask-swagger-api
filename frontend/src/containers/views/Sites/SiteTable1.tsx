import React from 'react'
import { Table, Divider, Popconfirm } from 'antd'
import { observer } from 'mobx-react'

import styles from './index.scss'
import { useOnMount } from '@utils/hooks'
import useRootStore from '@store/useRootStore'
import SiteModal from './SiteModal'
import 'antd/es/grid/style/css';
import { Mention } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

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
                rowKey="id"
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
                <Table.Column<IUserStore.IUser> key="id" title="id" dataIndex="id" width={30} />
                <Table.Column<ISiteStore.ISite> key="host" title="Host" dataIndex="host" width={120} />
                <Table.Column<ISiteStore.ISite> key="ip" title="IP" dataIndex="ip" width={100} />
                <Table.Column<ISiteStore.ISite> key="port" title="Port" dataIndex="port" width={80} />
                <Table.Column<ISiteStore.ISite> key="ga" title="Google Analytics" dataIndex="ga" width={120} />  
                <Table.Column<ISiteStore.ISite> key="date_added" title="Added At" dataIndex="date_added" width={120} />
                <Table.Column<ISiteStore.ISite> key="date_last_crawled" title="Last Crawled At" dataIndex="date_last_crawled" width={120} />
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
                                title="Delete?"
                                onConfirm={() => siteStore.deleteSite(record.id)}
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