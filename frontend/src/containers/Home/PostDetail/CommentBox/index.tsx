import React, { useCallback, useRef } from 'react'
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Row,
  Typography,
  Notification,
  Divider,
} from '@douyinfe/semi-ui'
import { PostComment } from '@/utils/Request/PostComment'
import { IconGlobeStroke, IconMail } from '@douyinfe/semi-icons'
import { useSelector } from 'react-redux'
import { RootState, store } from '@/store'
import styles from './index.module.scss'
import { useNavigate } from 'react-router'
import { PathName } from '@/routes'
import { useRequest } from 'ahooks'
import { Request } from '@/utils'
import { CodeDictionary } from '@/utils/Request/type'
import isURL from 'validator/lib/isUrl'
import isEmail from 'validator/lib/isEmail'
import { AssociatedPost } from '@/utils/Request/Post'

const { Text, Title } = Typography

type FormValues = Pick<PostComment, 'pid' | 'uid' | 'content' | 'email' | 'url'>

interface CommentBoxProps {
  post: AssociatedPost
}

const CommentBox = React.memo<CommentBoxProps>(({ post }) => {
  const formRef = useRef<Form<FormValues>>(null)
  const navigate = useNavigate()
  const { isLogin, userInfo } = useSelector((state: RootState) => state.common)
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

  return (
    <Row type='flex' justify='center' style={{ marginBottom: 20 }}>
      <Col span={18} xl={14} xxl={12} style={{ position: 'relative' }}>
        <Card
          className={styles.card}
          title='添加新评论'
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
  )
})

export default CommentBox
