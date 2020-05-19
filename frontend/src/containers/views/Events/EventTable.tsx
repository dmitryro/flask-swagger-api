import React from 'react'
import { Table, Divider, Popconfirm } from 'antd'
import { observer } from 'mobx-react'

import styles from './index.scss'
import { useOnMount } from '@utils/hooks'
import useRootStore from '@store/useRootStore'
import EventModal from './EventModal'

interface IProps {
    scrollY: number
}

function EventTable({ scrollY }: IProps) {
    const { eventStore } = useRootStore()

    const [modalVisible, setModalVisible] = React.useState(false)
    const [currentEvent, setCurrentEvent] = React.useState<IEventStore.IEvent>(null)

    function modifyEvent(event: IEventStore.IEvent) {
        setCurrentEvent(event)
        setModalVisible(true)
    }

    useOnMount(eventStore.getEvents)

    return (
        <React.Fragment>
            <Table<IEventStore.IEvent>
                className="center-table"
                style={{ width: '100%' }}
                bordered
                rowKey="_id"
                loading={eventStore.getEventsloading}
                dataSource={eventStore.events}
                scroll={{ y: scrollY }}
                pagination={{
                    current: eventStore.pageIndex,
                    showSizeChanger: true,
                    pageSize: eventStore.pageSize,
                    pageSizeOptions: ['30', '20', '10'],
                    total: eventStore.total
                }}
                onChange={eventStore.handleTableChange}
            >
            </Table>
            <EventModal visible={modalVisible} onCancel={() => setModalVisible(false)} event={currentEvent} />
        </React.Fragment>
    )
}

export default observer(EventTable)
