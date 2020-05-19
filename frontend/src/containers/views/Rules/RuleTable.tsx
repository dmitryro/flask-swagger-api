import React from 'react'
import { Table, Divider, Popconfirm } from 'antd'
import { observer } from 'mobx-react'

import styles from './index.scss'
import { useOnMount } from '@utils/hooks'
import useRootStore from '@store/useRootStore'
import RuleModal from './RuleModal'

interface IProps {
    scrollY: number
}

function RuleTable({ scrollY }: IProps) {
    const { ruleStore } = useRootStore()

    const [modalVisible, setModalVisible] = React.useState(false)
    const [currentRule, setCurrentRule] = React.useState<IRuleStore.IRule>(null)

    function modifyRule(rule: IRuleStore.IRule) {
        setCurrentRule(rule)
        setModalVisible(true)
    }

    useOnMount(ruleStore.getRules)

    return (
        <React.Fragment>
            <Table<IRuleStore.IRule>
                className="center-table"
                style={{ width: '100%' }}
                bordered
                rowKey="_id"
                loading={ruleStore.getRulesloading}
                dataSource={ruleStore.rules}
                scroll={{ y: scrollY }}
                pagination={{
                    current: ruleStore.pageIndex,
                    showSizeChanger: true,
                    pageSize: ruleStore.pageSize,
                    pageSizeOptions: ['30', '20', '10'],
                    total: ruleStore.total
                }}
                onChange={ruleStore.handleTableChange}
            >
            </Table>
            <RuleModal visible={modalVisible} onCancel={() => setModalVisible(false)} rule={currentRule} />
        </React.Fragment>
    )
}

export default observer(RuleTable)
