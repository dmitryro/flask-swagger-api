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

const ruleSeverity = ['low', 'mild', 'medium', 'elevated', 'high', 'highest']

interface IProps extends FormComponentProps {
    visible: boolean
    onCancel: () => void
    rule?: IRuleStore.IRule
}

function RuleModal({ visible, onCancel, rule, form }: IProps) {
    const { ruleStore } = useRootStore()

    const [loading, setLoading] = React.useState(false)

    const typeIsAdd = rule === undefined

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
                            if (ruleStore!==undefined) {
                                await ruleStore.createRule(values)
                            }
                        } else {
                            await ruleStore.modifyRule({ ...values, id: rule.id })
                            ruleStore.getRules()
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
            title={typeIsAdd ? 'Add Rule' : 'Modify Rule'}
            visible={visible}
            onOk={submit}
            onCancel={onCancel}
            okButtonProps={{ loading }}
        >
            <Form onSubmit={submit}>
                <FormItem {...formItemLayout} label="name">
                    {getFieldDecorator('name', {
                        initialValue: rule ? rule.name : '',
                        rules: [{ required: true }]
                    })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="code">
                    {getFieldDecorator('code', {
                        initialValue: rule ? rule.code : '',
                        rules: [{ required: true }]
                    })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="severity">
                    {getFieldDecorator('severity', {
                        initialValue: rule ? rule.severity : ruleSeverity[0],
                        rules: [{ required: true }]
                    })(
                        <Select>
                            {ruleSeverity.map(c => (
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
export default Form.create<IProps>()(observer(RuleModal))
