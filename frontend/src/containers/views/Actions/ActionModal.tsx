import React from 'react'
import { observer } from 'mobx-react'
import { Form } from '@ant-design/compatible'
import { Modal, Input, Select } from 'antd'
import 'antd/es/grid/style/css' 
import { Mention } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { FormComponentProps } from 'antd/lib/form'

import useRootStore from '@store/useRootStore'

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

const actionCategory = ['action']

interface IProps extends FormComponentProps {
    visible: boolean
    onCancel: () => void
    action?: IActionStore.IAction
}

function ActionModal({ visible, onCancel, action, form }: IProps) {
    const { actionStore } = useRootStore()

    const [loading, setLoading] = React.useState(false)

    const typeIsAdd = action === undefined

    function toggleLoading() {
        setLoading(l => !l)
    }

    function submit(e?: React.FormEvent<any>) {
        if (e) {
            e.preventDefault()
        }
        form.validateFields(
            async (err, values): Promise<any> => {
                if (!err) {
                    toggleLoading()
                    try {
                        if (typeIsAdd) {
                            if (actionStore!==undefined) {
                                await actionStore.createAction(values)
                                //actionStore.changePageIndex(1)
                            }
                        } else {
                            await actionStore.modifyAction({ ...values, _id: action._id })
                            actionStore.getActions()
                        }
                        onCancel()
                    } catch (err) {
                        console.log("THERE IS AN ERROR "+JSON.stringify(err));
                    }
                    toggleLoading()
                }
            }
        )
    }

    const { getFieldDecorator } = form
    return (
        <Modal
            title={typeIsAdd ? 'Add Action' : 'Modify Action'}
            visible={visible}
            onOk={submit}
            onCancel={onCancel}
            okButtonProps={{ loading }}
        >
            <Form onSubmit={submit}>
            </Form>
        </Modal>
    )
}
export default Form.create<IProps>()(observer(ActionModal))
