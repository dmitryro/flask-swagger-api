import React from 'react'
import { observer } from 'mobx-react'
import { Form } from '@ant-design/compatible'
import { Modal, Input, Select } from 'antd'
import 'antd/es/grid/style/css' 
import { Mention } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { FormComponentProps } from 'antd/lib/form'
import useForceUpdate from 'use-force-update';
import useRootStore from '@store/useRootStore'
import {updateExternalState} from '@components/LogsTable';
import LogsTable from '@components/LogsTable';

const FormItem = Form.Item

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 }
    }
}

const logCategory = ['log']

interface IProps extends FormComponentProps {
    visible: boolean
    onCancel: () => void
    log?: ILogStore.ILog
}

async function updateTable(store) {
    updateExternalState([], store, store.component, store.forceUpdate);
    return false;
}

function LogModal({ visible, onCancel, log, form }: IProps) {
    const { logStore } = useRootStore()
    const forceUpdate = useForceUpdate();
    const [loading, setLoading] = React.useState(false)

    const typeIsDelete = log === undefined

    function toggleLoading() {
        setLoading(l => !l)
    }

    function submit(e?: React.FormLog<any>) {
        if (e) {
            e.preventDefault()
        }
        form.validateFields(
            async (err, values): Promise<any> => {
                if (!err) {
                    toggleLoading()
                    try {
                        if (typeIsDelete) {
                            if (logStore!==undefined) {
                                //await logStore.pushLogs(values);
                                 console.log("BEFORE WE DELETE "+JSON.stringify(logStore.selectedRows));
                                 logStore.deleteSelected();
                                //logStore.changePageIndex(1)
                                 await updateTable(logStore);
                            }
                            
                        } else {
                            //await logStore.modifyLog({ ...values, id: log.id })
                            //logStore.getLogs()
                        }
                        onCancel()
                    } catch (err) {
                        console.log("THERE IS AN ERROR "+err);
                    }
                    toggleLoading()
                }
            }
        )
    }

    const { getFieldDecorator } = form
    return (
        <Modal
            title={typeIsDelete ? 'Delete Log' : 'Modify Log'}
            visible={visible}
            onOk={submit}
            onCancel={onCancel}
            okButtonProps={{ loading }}
        >
            Are you sure you want to delete {logStore.total} items?
            <Form onSubmit={submit}>
            </Form>
        </Modal>
    )
}
export default Form.create<IProps>()(observer(LogModal))
