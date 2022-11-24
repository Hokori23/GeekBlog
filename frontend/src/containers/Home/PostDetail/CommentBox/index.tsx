import React, { useRef } from 'react'
import { Avatar, Button, Card, Col, Form, Row } from '@douyinfe/semi-ui'
import { Input } from '@douyinfe/semi-ui/lib/es/input'
import { PostComment } from '@/utils/Request/PostComment'
import { IconEdit, IconGlobeStroke, IconMail } from '@douyinfe/semi-icons'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import styles from './index.module.scss'

const CommentBox = React.memo(() => {
  const formRef = useRef<Form>(null)
  const { isLogin, userInfo } = useSelector((state: RootState) => state.common)

  return (
    <Row type='flex' justify='center' style={{ marginBottom: 20 }}>
      <Col span={18} xl={14} xxl={12} style={{ position: 'relative' }}>
        <Card
          className={styles.card}
          title='添加新评论'
          headerExtraContent='前往登录账号'
          actions={[
            // eslint-disable-next-line react/jsx-key
            <Button>发送</Button>,
          ]}
        >
          <Form<Partial<PostComment>>
            ref={formRef}
            wrapperCol={{ span: 18 }}
            labelCol={{ span: 4 }}
            labelPosition='left'
          >
            {isLogin ? (
              <Avatar
                alt={userInfo?.userName}
                size='small'
                src={userInfo?.avatarUrl}
                style={{ marginRight: 12 }}
              />
            ) : (
              <>
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
                        /^[a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/.test(
                          value,
                        ),
                      message: '邮箱格式错误',
                    },
                  ]}
                />
                <Form.Input
                  field='url'
                  label='个人网站'
                  addonBefore={<IconGlobeStroke />}
                  prefix='https://'
                  showClear
                  trigger={['blur', 'change']}
                  rules={[
                    {
                      validator: (_, value) =>
                        /(https?:)\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(
                          value,
                        ),
                      message: '网站格式不合法',
                    },
                  ]}
                />
              </>
            )}
            <Form.TextArea
              field='content'
              label='评论内容'
              autosize
              rows={3}
              showClear
              trigger={['blur', 'change']}
              rules={[{ required: true, message: '评论不能为空' }]}
            />
          </Form>
        </Card>
      </Col>
    </Row>
  )
})

export default CommentBox
