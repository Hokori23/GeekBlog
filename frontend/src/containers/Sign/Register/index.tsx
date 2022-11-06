import { useEffect, useRef, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { PathName, RouteConfig } from '@/routes'
import { Button, Col, Form, Modal, Row, Typography, Toast } from '@douyinfe/semi-ui'
import { useRequest } from 'ahooks'
import { Request } from '@/utils'
import { Gender, GenderCN, User } from '@/utils/Request/User'
import {
  IconArrowRight,
  IconKey,
  IconLock,
  IconMail,
  IconMailStroked1,
  IconMale,
  IconUser,
  IconUserCircle,
  IconSend,
} from '@douyinfe/semi-icons'
import { useSelector } from 'react-redux'
import { RootState, store } from '@/store'
import React from 'react'

const { Title, Text } = Typography

const Register = React.memo<RouteComponentProps & RouteConfig>(({ location, history }) => {
  const formRef = useRef<Form>(null)
  const { isLogin } = useSelector((state: RootState) => state.common)
  const dispatch = useSelector(() => store.dispatch.common)
  const needRedirect = location.pathname === PathName.LOGIN && isLogin

  const [modalTimer, setModalTimer] = useState<NodeJS.Timeout | null>()

  const registerService = useRequest(
    async (user: Partial<User>) => {
      try {
        const formApi = formRef.current!.formApi
        await formApi.validate()
        const res = await Request.User.Login(user)
        if (res?.data) {
          dispatch.setUserInfo(res.data)
          dispatch.setToken(res.data.token)
          const { destroy } = Modal.info({
            title: '提示',
            content: '登陆成功，正在跳转到首页',
            okText: '跳转',
            closable: false,
            afterClose: dispatch.login,
            hasCancel: false,
          })
          setModalTimer(setTimeout(destroy, 1500))
        }
      } catch {}
    },
    {
      manual: true,
    },
  )

  const sendCaptchaService = useRequest(
    async () => {
      try {
        const formApi = formRef.current!.formApi
        await formApi.validate(['userAccount', 'userName', 'email'])
        const data = formApi.getValues()
        const res = await Request.User.SendCaptcha(data)
        if (res?.code === 0) {
          Toast.info({
            content: res.message,
          })
        }
      } catch {}
    },
    {
      manual: true,
    },
  )

  useEffect(() => {
    if (needRedirect) {
      Toast.info({
        duration: 1,
        content: '已登录，正在跳转到首页',
        onClose: () => history.replace(`${PathName.HOME}`),
      })
    }
    return () => {
      modalTimer && clearTimeout(modalTimer)
    }
  }, [isLogin])

  return (
    <div id='LoginContainer'>
      <Row type='flex' justify='center'>
        <Title heading={1} type='primary'>
          登录
        </Title>
      </Row>
      <Form
        wrapperCol={{ span: 18 }}
        labelCol={{ span: 6 }}
        ref={formRef}
        labelPosition='left'
        autoScrollToError={{ behavior: 'smooth' }}
        disabled={registerService.loading || needRedirect}
        onSubmit={registerService.run}
      >
        <Form.Input
          field='userAccount'
          label='账号'
          prefix={<IconUser />}
          showClear
          trigger={['blur', 'change']}
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
          prefix={<IconUserCircle />}
          showClear
          trigger={['blur', 'change']}
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
          prefix={<IconLock />}
          showClear
          trigger={['blur', 'change']}
          mode='password'
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
          prefix={<IconKey />}
          showClear
          trigger={['blur', 'change']}
          rules={[
            { required: true, message: '请填写确认密码' },
            {
              validator: (_, value) => formRef.current!.formApi.getValue('password') === value,
              message: '两次填写密码不匹配',
            },
          ]}
        />
        <Form.Input
          field='email'
          label='邮箱'
          prefix={<IconMail />}
          showClear
          trigger={['blur', 'change']}
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
          prefix={<IconMailStroked1 />}
          suffix={
            <Button theme='borderless' onClick={sendCaptchaService.run} icon={<IconSend />}>
              发送验证码
            </Button>
          }
          showClear
          trigger={['blur', 'change']}
          rules={[
            { required: true, message: '邮箱验证码不能为空' },
            {
              validator: (_, value) => !value || /^[a-z0-9]{8,8}$/.test(value),
              message: '邮箱验证码为8位小写字母和数字组成，请检查格式',
            },
          ]}
        />
        <Form.Select
          field='gender'
          label='性别'
          style={{ width: '100%' }}
          prefix={<IconMale />}
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
        <Row type='flex' justify='center' style={{ marginTop: 8 }}>
          <Col span={12}>
            <Button
              block
              type='primary'
              theme='solid'
              htmlType='submit'
              loading={registerService.loading}
            >
              注册
            </Button>
          </Col>
        </Row>
        <Row type='flex' justify='center' style={{ marginTop: 12 }}>
          <Text link onClick={() => history.push(PathName.LOGIN)}>
            前往登录
            <IconArrowRight />
          </Text>
        </Row>
      </Form>
    </div>
  )
})
export default Register
