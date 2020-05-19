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

const contactCategory = ['contact']

interface IProps extends FormComponentProps {
    visible: boolean
    onCancel: () => void
    contact?: IContactStore.IContact
}

function ContactModal({ visible, onCancel, contact, form }: IProps) {
    const { contactStore } = useRootStore()

    const [loading, setLoading] = React.useState(false)

    const typeIsAdd = contact === undefined

    function toggleLoading() {
        setLoading(l => !l)
    }

    function submit(e?: React.FormContact<any>) {
        if (e) {
            e.prcontactDefault()
        }
        form.validateFields(
            async (err, values): Promise<any> => {
                if (!err) {
                    toggleLoading()
                    try {
                        if (typeIsAdd) {
                            if (contactStore!==undefined) {
                                await contactStore.createContact(values)
                                //contactStore.changePageIndex(1)
                            }
                        } else {
                            await contactStore.modifyContact({ ...values, _id: contact._id })
                            contactStore.getContacts()
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
            title={typeIsAdd ? 'Add Contact' : 'Modify Contact'}
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
export default Form.create<IProps>()(observer(ContactModal))
