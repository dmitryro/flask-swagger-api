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

const analyticCategory = ['analytic']

interface IProps extends FormComponentProps {
    visible: boolean
    onCancel: () => void
    analytic?: IAnalyticStore.IAnalytic
}

function AnalyticModal({ visible, onCancel, analytic, form }: IProps) {
    const { analyticStore } = useRootStore()

    const [loading, setLoading] = React.useState(false)

    const typeIsAdd = analytic === undefined

    function toggleLoading() {
        setLoading(l => !l)
    }

    function submit(e?: React.FormAnalytic<any>) {
        if (e) {
            e.pranalyticDefault()
        }
        form.validateFields(
            async (err, values): Promise<any> => {
                if (!err) {
                    toggleLoading()
                    try {
                        if (typeIsAdd) {
                            if (analyticStore!==undefined) {
                                await analyticStore.createAnalytic(values)
                                //analyticStore.changePageIndex(1)
                            }
                        } else {
                            await analyticStore.modifyAnalytic({ ...values, _id: analytic._id })
                            analyticStore.getAnalytics()
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
            title={typeIsAdd ? 'Add Analytic' : 'Modify Analytic'}
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
export default Form.create<IProps>()(observer(AnalyticModal))
