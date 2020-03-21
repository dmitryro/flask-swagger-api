import React from 'react'
import { observer } from 'mobx-react'
import { Modal, Form, Input, Select } from 'antd'
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

const actionCategory = ['action', 'admin']

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
                            await actionStore.createAction(values)
                            actionStore.changePageIndex(1)
                        } else {
                            await actionStore.modifyAction({ ...values, _id: action._id })
                            actionStore.getActions()
                        }
                        onCancel()
                    } catch (err) {}
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
                <FormItem {...formItemLayout} label="account">
                    {getFieldDecorator('account', {
                        initialValue: action ? action.account : '',
                        rules: [{ required: true }]
                    })(<Input />)}
                </FormItem>
                {typeIsAdd && (
                    <FormItem {...formItemLayout} label="password">
                        {getFieldDecorator('password', {
                            rules: [{ required: true }]
                        })(<Input />)}
                    </FormItem>
                )}
                <FormItem {...formItemLayout} label="category">
                    {getFieldDecorator('category', {
                        initialValue: action ? action.category : actionCategory[0],
                        rules: [{ required: true }]
                    })(
                        <Select>
                            {actionCategory.map(c => (
                                <Select.Option key={c} value={c}>
                                    {c}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                </FormItem>
            </Form>
        </Modal>
    )
}

export default Form.create<IProps>()(observer(ActionModal))
