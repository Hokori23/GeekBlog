import { PathName } from '@/routes'
import { RootState, store } from '@/store'
import { PostComment } from '@/utils/Request/PostComment'
import { CodeDictionary } from '@/utils/Request/type'
import { IconMail, IconGlobeStroke } from '@douyinfe/semi-icons'
import {
  Card,
  Form,
  List,
  Row,
  Col,
  Avatar,
  Button,
  Divider,
  Typography,
  Notification,
} from '@douyinfe/semi-ui'
import { useRequest } from 'ahooks'
import React, { useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import isEmail from 'validator/lib/isEmail'
import isURL from 'validator/lib/isURL'
import styles from './index.module.scss'
import { Request } from '@/utils'

type FormValues = Pick<
  PostComment,
  'pid' | 'uid' | 'content' | 'email' | 'url' | 'rootId' | 'parentId'
>

const { Text, Title } = Typography

interface ReplyCommentBoxProps {
  show?: boolean
}

const ReplyCommentBox = React.memo<ReplyCommentBoxProps>(({ show }) => {
  const formRef = useRef<Form<FormValues>>(null)
  const navigate = useNavigate()
  const { isLogin, userInfo } = useSelector((state: RootState) => state.common)
  const { post } = useSelector((state: RootState) => state.postDetail)
  const dispatch = useSelector(() => store.dispatch.postDetail)
  const getFormApi = () => formRef.current?.formApi

  const { run, loading } = useRequest(
    async (postComment: Partial<PostComment>) => {
      try {
        if (!post) {
          // TODO 上报错误
          console.error('Post不存在')
          return
        }
        await getFormApi()?.validate()
        const res = await Request.PostComment.Create(postComment)
        if (res?.code === CodeDictionary.SUCCESS && res?.data) {
          dispatch.setPost({
            ...post,
            postComments: [...(post?.postComments || []), res.data],
          })
          Notification.success({ content: res.message })
          getFormApi()?.reset()
        }
      } catch {}
    },
    {
      manual: true,
    },
  )

  const getPostComment = useCallback(() => {
    const formValues = getFormApi()?.getValues?.() || {}

    const { id: uid, email, url } = userInfo || {}
    const extraUserInfo = {
      uid: uid || 2, // 评论用户id, 2 代表未注册用户
      email,
      url,
    }

    return {
      ...formValues,
      pid: post?.id,
      ...(isLogin ? extraUserInfo : { uid: 2 }),
    }
  }, [getFormApi, userInfo, isLogin])

  if (!show) {
    return null
  }

  return (
    <List.Item>
      <Row type='flex' justify='center' style={{ width: '100%' }}>
        <Col span={24}>
          <Card
            className={styles.card}
            title='回复评论'
            headerExtraContent={
              !isLogin && (
                <Row type='flex' justify='center'>
                  <Text className={styles.link} link onClick={() => navigate(PathName.LOGIN)}>
                    {/* TODO: 登录后跳回此处 */}
                    <Title heading={6}>前往登录账号</Title>
                  </Text>
                </Row>
              )
            }
            // actions={[
            //   // eslint-disable-next-line react/jsx-key
            //   <Row type='flex' justify='end'>
            //     <Button theme='solid' onClick={() => run(getPostComment())} loading={loading}>
            //       发送
            //     </Button>
            //   </Row>,
            // ]}
            footer={
              <>
                <Divider />
                <Row type='flex' justify='end' style={{ marginTop: 10 }}>
                  <Button theme='solid' onClick={() => run(getPostComment())} loading={loading}>
                    发送
                  </Button>
                </Row>
              </>
            }
          >
            <Form<FormValues>
              ref={formRef}
              wrapperCol={{ span: isLogin ? 22 : 18 }}
              labelCol={{ span: isLogin ? 2 : 4 }}
              labelPosition='left'
              disabled={loading}
            >
              {!isLogin && (
                <>
                  <Form.Input
                    field='email'
                    label='邮箱'
                    prefix={<IconMail />}
                    showClear
                    trigger={['change']}
                    rules={[
                      { required: true, message: '邮箱不能为空' },
                      {
                        validator: (_, value) => {
                          try {
                            return isEmail(value)
                          } catch {}
                          return false
                        },
                        message: '邮箱格式错误',
                      },
                    ]}
                  />
                  <Form.Input
                    field='url'
                    label='个人网站'
                    prefix={<IconGlobeStroke />}
                    // prefix='https://'
                    showClear
                    trigger={['change']}
                    rules={[
                      {
                        validator: (_, value) => {
                          try {
                            return isURL(value)
                          } catch {}
                          return false
                        },
                        message: '网站格式不合法',
                      },
                    ]}
                  />
                </>
              )}
              <Form.TextArea
                field='content'
                label={
                  isLogin && (
                    <Avatar
                      alt={userInfo?.userName}
                      size='small'
                      src={userInfo?.avatarUrl}
                      style={{ marginRight: 12 }}
                    />
                  )
                }
                autosize
                rows={3}
                showClear
                placeholder='快来留下你的评论吧'
                trigger={['change']}
                rules={[{ required: true, message: '评论不能为空' }]}
              />
            </Form>
          </Card>
        </Col>
      </Row>
    </List.Item>
  )
})

export default ReplyCommentBox
