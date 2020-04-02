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

const siteCategory = ['site', 'admin']

interface IProps extends FormComponentProps {
    visible: boolean
    onCancel: () => void
    site?: ISiteStore.ISite
}

function SiteModal({ visible, onCancel, site, form }: IProps) {
    const { siteStore } = useRootStore()

    const [loading, setLoading] = React.useState(false)

    const typeIsAdd = site === undefined

    function toggleLoading() {
        setLoading(l => !l)
    }

    function submit(e?: React.FormEvent<any>) {
        alert("SITE STORE "+siteStore);
        if (e) {
            e.preventDefault()
        }
        form.validateFields(
            async (err, values): Promise<any> => {
                if (!err) {
                    alert("THERE WERE NO ERRORS");
                    toggleLoading()
                    try {
                        if (typeIsAdd) {
                            if (siteStore!==undefined) {
                                alert("SITE IS THERE"+JSON.stringify(siteStore));
                                //await siteStore.createSite(values)
                                siteStore.changePageIndex(1)
                            }
                        } else {
                            alert("ALL GOOD - SITE ID "+site._id);
                            await siteStore.modifySite({ ...values, _id: site._id })
                            siteStore.getSites()
                        }
                        onCancel()
                    } catch (err) {
                        alert("THERE IS AN ERROR "+err);
                    }
                    toggleLoading()
                }
            }
        )
    }

    const { getFieldDecorator } = form
    return (
        <Modal
            title={typeIsAdd ? 'Add Site' : 'Modify Site'}
            visible={visible}
            onOk={submit}
            onCancel={onCancel}
            okButtonProps={{ loading }}
        >
            <Form onSubmit={submit}>
                <FormItem {...formItemLayout} label="address">
                    {getFieldDecorator('address', {
                        initialValue: site ? site.address : '',
                        rules: [{ required: true }]
                    })(<Input />)}
                </FormItem>

                <FormItem {...formItemLayout} label="port">
                    {getFieldDecorator('port', {
                        initialValue: site ? site.port : '',
                        rules: [{ required: false }]
                    })(<Input />)}
                </FormItem>

                <FormItem {...formItemLayout} label="ga">
                        {getFieldDecorator('ga', {
                            rules: [{ required: true }]
                        })(<Input />)}
                </FormItem>
            </Form>
        </Modal>
    )
}
export default Form.create<IProps>()(observer(SiteModal))
