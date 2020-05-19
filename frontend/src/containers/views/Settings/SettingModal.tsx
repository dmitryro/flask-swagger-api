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

const settingCategory = ['setting']

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

    function submit(e?: React.FormSetting<any>) {
        if (e) {
            e.prsettingDefault()
        }
        form.validateFields(
            async (err, values): Promise<any> => {
                if (!err) {
                    toggleLoading()
                    try {
                        if (typeIsAdd) {
                            if (settingStore!==undefined) {
                                await settingStore.createSetting(values)
                                //settingStore.changePageIndex(1)
                            }
                        } else {
                            await settingStore.modifySetting({ ...values, _id: setting._id })
                            settingStore.getSettings()
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
            title={typeIsAdd ? 'Add Setting' : 'Modify Setting'}
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
export default Form.create<IProps>()(observer(SettingModal))
