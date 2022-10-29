import { FC, useEffect, useRef, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { PathName, RouteConfig } from '@/routes'
import { Request } from '@/utils'
import { useRequest, useAsyncEffect } from 'ahooks'
import { Banner, Button, Form, Modal, Notification, Typography } from '@douyinfe/semi-ui'
import { Gender, GenderCN } from '@/utils/Request/User'
import Spin from '@/components/Spin'
import styles from './index.module.scss'

const { Title } = Typography

const Init: FC<RouteComponentProps & RouteConfig> = ({ history }) => {
  const formRef = useRef<Form>(null)

  const initDataBaseService = useRequest(Request.Init.Init, {
    manual: true,
  })
  const registerDataBaseService = useRequest(
    async () => {
      try {
        const formApi = formRef.current!.formApi
        await formApi.validate()
        const user = await Request.User.Init(formApi.getValues())
        if (user) {
          const { destroy } = Modal.info({
            title: '提示',
            content: '注册成功，正在跳转到登陆页面',
            okText: '跳转',
            closable: false,
            afterClose: () => history.replace(`${PathName.LOGIN}`),
            hasCancel: false,
          })
          setModalTimer(setTimeout(destroy, 2000))
        }
      } catch {}
    },
    {
      manual: true,
    },
  )

  const [initErrorMsg, setInitErrorMsg] = useState('')
  const [modalTimer, setModalTimer] = useState<NodeJS.Timeout | null>()

  const formDisabled = initDataBaseService.loading || registerDataBaseService.loading

  useAsyncEffect(async () => {
    const res = await initDataBaseService.runAsync()
    if (res?.code === 0) {
      Notification.success({
        title: '提示',
        content: res.message,
      })
    } else if (res?.message) {
      setInitErrorMsg(res.message)
    }
  }, [])

  useEffect(() => () => {
    modalTimer && clearTimeout(modalTimer)
  })

  return (
    <div id='InitContainer'>
      {initDataBaseService.loading && <Spin />}
      <Title>GeekBlog</Title>
      {initErrorMsg && <Banner onClose={() => setInitErrorMsg('')}>{initErrorMsg}</Banner>}
      <Form
        ref={formRef}
        autoScrollToError={{ behavior: 'smooth' }}
        disabled={formDisabled}
        onSubmit={registerDataBaseService.run}
      >
        <Form.Input
          field='userAccount'
          label='账号'
          rules={[
            { required: true, message: '请填写账号' },
            {
              validator: (_, value) => /^.{5,20}$/.test(value),
              message: '用户账号长度应为5至20字符',
            },
            {
              validator: (_, value) => /^\w+$/.test(value),
              message: '用户账号只能由字母、数字、下划线组成',
            },
          ]}
        />
        <Form.Input
          field='userName'
          label='用户名'
          rules={[
            { required: true, message: '请填写用户名' },
            {
              validator: (_, value) => /^.{2,20}$/.test(value),
              message: '用户名长度应为2至20字符',
            },
            {
              validator: (_, value) => /^\w+$/.test(value),
              message: '用户名只能由字母、数字、下划线组成',
            },
          ]}
        />
        <Form.Input
          field='password'
          label='密码'
          rules={[
            { required: true, message: '请填写密码' },
            {
              validator: (_, value) => /^.{5,20}$/.test(value),
              message: '密码长度应为5至20字符',
            },
            {
              validator: (_, value) => /^\w+$/.test(value),
              message: '密码只能由字母、数字、下划线组成',
            },
          ]}
        />
        <Form.Input
          field='doubleCheckPassword'
          label='确认密码'
          trigger='blur'
          rules={[
            { required: true, message: '请填写确认密码' },
            {
              validator: (_, value) => formRef.current?.formApi.getValue('password') === value,
              message: '两次填写密码不匹配',
            },
          ]}
        />
        <Form.Input
          field='email'
          label='邮箱'
          rules={[
            { required: true, message: '邮箱不能为空' },
            {
              validator: (_, value) =>
                /^[a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/.test(value),
              message: '邮箱格式错误',
            },
          ]}
        />
        <Form.Input
          field='emailCaptcha'
          label='邮箱验证码'
          rules={[
            { required: true, message: '邮箱验证码不能为空' },
            {
              validator: (_, value) => /^[a-z0-9]{8,8}$/.test(value),
              message: '邮箱验证码为8位小写字母和数字组成，请检查格式',
            },
          ]}
        />
        <Form.Select
          field='gender'
          label='性别'
          placeholder='请选择性别'
          initValue={Gender.UNKNOWN}
          optionList={[
            {
              value: Gender.UNKNOWN,
              label: GenderCN.UNKNOWN,
            },
            {
              value: Gender.MALE,
              label: GenderCN.MALE,
            },
            {
              value: Gender.FEMALE,
              label: GenderCN.FEMALE,
            },
          ]}
        />
        <Button
          type='primary'
          theme='solid'
          htmlType='submit'
          loading={registerDataBaseService.loading}
        >
          注册
        </Button>
      </Form>
    </div>
  )
}

export default withRouter(Init)
