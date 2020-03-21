import React from 'react'
import { Table, Divider, Popconfirm } from 'antd'
import { observer } from 'mobx-react'

import styles from './index.scss'
import { useOnMount } from '@utils/hooks'
import useRootStore from '@store/useRootStore'
import FilterModal from './FilterModal'

interface IProps {
    scrollY: number
}

function FilterTable({ scrollY }: IProps) {
    const { filterStore } = useRootStore()

    const [modalVisible, setModalVisible] = React.useState(false)
    const [currentFilter, setCurrentFilter] = React.useState<IFilterStore.IFilter>(null)

    function modifyFilter(filter: IFilterStore.IFilter) {
        setCurrentFilter(filter)
        setModalVisible(true)
    }

    useOnMount(filterStore.getFilters)

    return (
        <React.Fragment>
            <Table<IUserStore.IUser>
                className="center-table"
                style={{ width: '100%' }}
                bordered
                rowKey="_id"
                loading={filterStore.getUsersloading}
                dataSource={filterStore.filters}
                scroll={{ y: scrollY }}
                pagination={{
                    current: filterStore.pageIndex,
                    showSizeChanger: true,
                    pageSize: filterStore.pageSize,
                    pageSizeOptions: ['30', '20', '10'],
                    total: filterStore.total
                }}
                onChange={filterStore.handleTableChange}
            >
            </Table>
        </React.Fragment>
    )
}

export default observer(FilterTable)
