import React from 'react'
import { Table, Divider, Popconfirm } from 'antd'
import { observer } from 'mobx-react'

import styles from './index.scss'
import { useOnMount } from '@utils/hooks'
import useRootStore from '@store/useRootStore'
import ChainModal from './ChainModal'

interface IProps {
    scrollY: number
}

function ChainTable({ scrollY }: IProps) {
    const { chainStore } = useRootStore()

    const [modalVisible, setModalVisible] = React.useState(false)
    const [currentChain, setCurrentChain] = React.useState<IChainStore.IChain>(null)

    function modifyChain(chain: IChainStore.IChain) {
        setCurrentChain(chain)
        setModalVisible(true)
    }

    useOnMount(chainStore.getChains)

    return (
        <React.Fragment>
            <Table<IChainStore.IChain>
                className="center-table"
                style={{ width: '100%' }}
                bordered
                rowKey="_id"
                loading={chainStore.getChainsloading}
                dataSource={chainStore.chains}
                scroll={{ y: scrollY }}
                pagination={{
                    current: chainStore.pageIndex,
                    showSizeChanger: true,
                    pageSize: chainStore.pageSize,
                    pageSizeOptions: ['30', '20', '10'],
                    total: chainStore.total
                }}
                onChange={chainStore.handleTableChange}
            >
            </Table>
            <ChainModal visible={modalVisible} onCancel={() => setModalVisible(false)} chain={currentChain} />
        </React.Fragment>
    )
}

export default observer(ChainTable)
