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

                <Table.Column<IRuleStore.IRule> key="id" title="ID" dataIndex="id" width={30} />
                <Table.Column<IRuleStore.IRule> key="name" title="Name" dataIndex="name" width={120} />
                <Table.Column<IRuleStore.IRule> key="code" title="Code" dataIndex="code" width={80} />
                <Table.Column<IRuleStore.IRule> key="isactive" title="Is Active" dataIndex="isactive" width={80} />
                <Table.Column<IRuleStore.IRule> key="severety" title="Severety" dataIndex="severety" width={100} />
                <Table.Column<IRuleStore.IRule> key="when_created" title="When Created" dataIndex="when_created" width={100} />
                <Table.Column<IRuleStore.IRule>
                    key="action"
                    title="Action"
                    width={120}
                    render={(_, record) => (
                        <span>
                            <span className={styles.ctrlEle} onClick={() => modifyRule(record)}>
                                Modify
                            </span>
                            <Divider type="vertical" />
                            <Popconfirm
                                placement="top"
                                title="Delete?"
                                onConfirm={() =>ruleStore.deleteRule(record.id)}
                                okText="Yes"
                                cancelText="No">
                                <span className={styles.ctrlEle}>Delete</span>
                            </Popconfirm>
                        </span>
                    )}
                />

            </Table>
            <RuleModal visible={modalVisible} onCancel={() => setModalVisible(false)} rule={currentRule} />
        </React.Fragment>
    )
}

export default observer(RuleTable)
