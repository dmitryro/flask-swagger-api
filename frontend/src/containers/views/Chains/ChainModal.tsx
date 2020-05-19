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

const chainCategory = ['chain']

interface IProps extends FormComponentProps {
    visible: boolean
    onCancel: () => void
    chain?: IChainStore.IChain
}

function ChainModal({ visible, onCancel, chain, form }: IProps) {
    const { chainStore } = useRootStore()

    const [loading, setLoading] = React.useState(false)

    const typeIsAdd = chain === undefined

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
                            if (chainStore!==undefined) {
                                await chainStore.createChain(values)
                                //chainStore.changePageIndex(1)
                            }
                        } else {
                            await chainStore.modifyChain({ ...values, _id: chain._id })
                            chainStore.getChains()
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
            title={typeIsAdd ? 'Add Chain' : 'Modify Chain'}
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
export default Form.create<IProps>()(observer(ChainModal))
