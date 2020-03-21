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

const settingCategory = ['setting', 'admin']

interface IProps extends FormComponentProps {
    visible: boolean
    onCancel: () => void
    setting?: ISettingStore.ISetting
}

function SettingModal({ visible, onCancel, setting, form }: IProps) {
    const { settingStore } = useRootStore()

    const [loading, setLoading] = React.useState(false)

    const typeIsAdd = setting === undefined

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
                            await settingStore.createSetting(values)
                            settingStore.changePageIndex(1)
                        } else {
                            await settingStore.modifySetting({ ...values, _id: setting._id })
                            settingStore.getSettings()
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
            title={typeIsAdd ? 'Add Setting' : 'Modify Setting'}
            visible={visible}
            onOk={submit}
            onCancel={onCancel}
            okButtonProps={{ loading }}
        >
            <Form onSubmit={submit}>
                <FormItem {...formItemLayout} label="account">
                    {getFieldDecorator('account', {
                        initialValue: setting ? setting.account : '',
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
                        initialValue: setting ? setting.category : settingCategory[0],
                        rules: [{ required: true }]
                    })(
                        <Select>
                            {settingCategory.map(c => (
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

export default Form.create<IProps>()(observer(SettingModal))
