import React from 'react'
import { Table, Divider, Popconfirm } from 'antd'
import LogsTable from '@components/LogsTable'
import { observer } from 'mobx-react'

import styles from './index.scss'
import { useOnMount } from '@utils/hooks'
import useRootStore from '@store/useRootStore'
import LogModal from './LogModal'
import useForceUpdate from 'use-force-update';

interface IProps {
    scrollY: number
}

const columns = [
  {
    name: 'ID',
    selector: 'id',
    sortable: true,
  },
  {
    name: 'Severity',
    selector: 'severity',
    sortable: true,
    right: true,
  },
  {
    name: 'Header',
    selector: 'header',
    sortable: true,
    right: true,
  },
  {
    name: 'Body',
    selector: 'body',
    sortable: true,
    right: true,
  },
  {
    name: 'Profile Key',
    selector: 'profile_key',
    sortable: true,
    right: true,
  },
  {
    name: 'Recorded at',
    selector: 'recorded_at',
    sortable: true,
    right: true,
  },
  {
    name: 'Type ID',
    selector: 'type_id',
    sortable: true,
    right: true,
  },
  {
    name: 'IP',
    selector: 'ip',
    sortable: true,
    right: true,
  }
];

const customStyles = {
  rows: {
    style: {
      minHeight: '52px', // override the row height
    }
  },
  headCells: {
    style: {
      paddingLeft: '8px', // override the cell padding for head cells
      paddingRight: '8px',
    },
  },
  cells: {
    style: {
      paddingLeft: '8px', // override the cell padding for data cells
      paddingRight: '8px',
    },
  },
};


function LogTable({ scrollY }: IProps) {
    const { logStore } = useRootStore()
    const [currentLog, setCurrentLog] = React.useState<ILogStore.ILog>(null)
    const [modalVisible, setModalVisible] = React.useState(false)
    const forceUpdate = useForceUpdate();

    function modifyLog(log: ILogStore.ILog) {
        setCurrentLog(log)
    }

    //useOnMount(logStore.getLogs)

    return (

        <LogsTable
          title="Access Log"
          columns={columns}
          onChange={forceUpdate}
          onClick={forceUpdate}
          customStyles={customStyles}
         />

    )
}

export default observer(LogTable)
