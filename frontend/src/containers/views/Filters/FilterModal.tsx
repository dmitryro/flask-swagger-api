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

const filterCategory = ['identity', 'engagement', 'fraud', 'security', 'diagnostic', 'spam', 'reputation', 'custom']

interface IProps extends FormComponentProps {
    visible: boolean
    onCancel: () => void
    filter?: IFilterStore.IFilter
}

function FilterModal({ visible, onCancel, filter, form }: IProps) {
    const { filterStore } = useRootStore()

    const [loading, setLoading] = React.useState(false)

    const typeIsAdd = filter === undefined

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
                            await filterStore.createFilter(values)
                            filterStore.changePageIndex(1)
                        } else {
                            await filterStore.modifyFilter({ ...values, _id: filter._id })
                            filterStore.getFilters()
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
            title={typeIsAdd ? 'Add Filter' : 'Modify Filter'}
            visible={visible}
            onOk={submit}
            onCancel={onCancel}
            okButtonProps={{ loading }}
        >
            <Form onSubmit={submit}>
                <FormItem {...formItemLayout} label="name">
                    {getFieldDecorator('name', {
                        initialValue: filter ? filter.name : '',
                        rules: [{ required: true }]
                    })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="category">
                    {getFieldDecorator('category', {
                        initialValue: filter ? filter.category : filterCategory[0],
                        rules: [{ required: true }]
                    })(
                        <Select>
                            {filterCategory.map(c => (
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

export default Form.create<IProps>()(observer(FilterModal))
