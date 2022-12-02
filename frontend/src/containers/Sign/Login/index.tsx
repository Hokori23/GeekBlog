import React, { useEffect, useRef, useState } from 'react'
import { PathName } from '@/routes'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Col, Form, Modal, Row, Typography, Toast } from '@douyinfe/semi-ui'
import { useRequest } from 'ahooks'
import { Request } from '@/utils'
import { User } from '@/utils/Request/User'
import { IconArrowRight, IconLock, IconUser } from '@douyinfe/semi-icons'
import { useSelector } from 'react-redux'
import { RootState, store } from '@/store'

const { Title, Text } = Typography

const Login = React.memo(() => {
  const location = useLocation()
  const navigate = useNavigate()
  const formRef = useRef<Form>(null)
  const { isLogin } = useSelector((state: RootState) => state.common)
  const dispatch = useSelector(() => store.dispatch.common)
  const needRedirect = location.pathname === PathName.LOGIN && isLogin

  const [modalTimer, setModalTimer] = useState<NodeJS.Timeout | null>()

  const loginService = useRequest(
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
            footer: <div style={{ padding: 8 }} />,
            closable: false,
            afterClose: () => {
              dispatch.login()
              navigate(`${PathName.HOME}`, {
                replace: true,
              })
            },
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

  useEffect(() => {
    if (needRedirect) {
      Toast.info({
        duration: 1,
        content: '已登录，正在跳转到首页',
        onClose: () =>
          navigate(`${PathName.HOME}`, {
            replace: true,
          }),
      })
    }
    return () => {
      modalTimer && clearTimeout(modalTimer)
    }
  }, [])

  return (
    <div id='LoginContainer'>
      <Row type='flex' justify='center'>
        <Title heading={1} type='primary'>
          登录
        </Title>
      </Row>
      <Form<Partial<User>>
        wrapperCol={{ span: 18 }}
        labelCol={{ span: 3 }}
        ref={formRef}
        labelPosition='inset'
        autoScrollToError={{ behavior: 'smooth' }}
        disabled={loginService.loading || needRedirect}
        onSubmit={loginService.run}
      >
        <Form.Input
          field='userAccount'
          placeholder='请填写账号'
          prefix={<IconUser />}
          showClear
          trigger={['blur', 'change']}
          size='large'
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
          field='password'
          placeholder='请填写密码'
          prefix={<IconLock />}
          showClear
          trigger={['blur', 'change']}
          size='large'
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
        <Row type='flex' justify='center' style={{ marginTop: 8 }}>
          <Col span={12}>
            <Button
              block
              type='primary'
              theme='solid'
              htmlType='submit'
              loading={loginService.loading}
            >
              登录
            </Button>
          </Col>
        </Row>
        <Row type='flex' justify='center' style={{ marginTop: 12 }}>
          <Text link onClick={() => navigate(PathName.REGISTER)}>
            还没有账号，前往注册
            <IconArrowRight />
          </Text>
        </Row>
      </Form>
    </div>
  )
})
export default Login
