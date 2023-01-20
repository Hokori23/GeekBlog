import React, { useMemo, useRef, useState } from 'react'
import { Col, Row, Divider, Form } from '@douyinfe/semi-ui'
import { useNavigate } from 'react-router-dom'
import { PathName } from '@/routes'
import useUrlParams from '@/hooks/useUrlParams'
import styles from './index.module.scss'
import useAuth from '@/hooks/useAuth'
import useService from './useService'
import classnames from 'classnames'
import { useUpdateEffect } from 'ahooks'

// components
import ScrollTop from '@/components/ScrollTop'
import Spin from '@/components/Spin'
import Banner from './Banner'
import Action from './Action'
import CommentBox from './CommentBox'
import CommentList from './CommentList'
import Markdown, { EditorHandler } from '@/components/Markdown/Editor'
import EditArea from './EditArea'
import { AssociatedPost, PostRequest } from '@/utils/Request/Post'
interface FeAssociatedPost
  extends Omit<AssociatedPost, 'isLocked' | 'isDraft' | 'isHidden' | 'tags'> {
  isLocked: boolean
  isDraft: boolean
  isHidden: boolean
  tags: number[] | undefined
}
type FormType = Partial<{
  post: FeAssociatedPost
  tids: number[] | undefined
}>

const PostDetail = React.memo(() => {
  const navigate = useNavigate()
  const { urlParams } = useUrlParams<{ id: string }>()
  const { id } = urlParams
  const { isAdmin } = useAuth()
  const [isEdit, setIsEdit] = useState(false)

  const { getPostService, editPostService, deletePostService, post } = useService({
    id: Number(id),
    onSave: () => setIsEdit(false),
    onDelete: () => navigate(PathName.HOME),
  })

  const formRef = useRef<Form<FormType>>(null)
  const markdownRef = useRef<EditorHandler | null>(null)

  const { formInitValues, key } = useMemo(() => {
    // 请求帖子完毕, 表单回显
    if (!getPostService.loading && !editPostService.loading && post) {
      const tags = post.tags?.map((v) => v.id!)
      // format一下方便表单展示
      return {
        formInitValues: {
          post: {
            ...post,
            isLocked: Boolean(post.isLocked),
            isDraft: Boolean(post.isDraft),
            isHidden: Boolean(post.isHidden),
            tags,
          },
          tids: tags,
        },
        key: Date.now(),
      }
    } else {
      // 请求不到
      return { formInitValues: undefined, key: Date.now() }
    }
  }, [getPostService.loading, editPostService.loading, post])

  const Content = useMemo(
    () => (
      <Markdown
        ref={markdownRef}
        className={classnames({
          [styles.markdown__edit]: isEdit,
        })}
        defaultValue={post?.content}
        readOnly={!isEdit}
      />
    ),
    [post?.content, isEdit],
  )

  const handleOnSave = () => {
    const postContent = markdownRef.current?.getValue() || ''
    const formValues = formRef.current?.formApi.getValues()
    const _post = {
      ...formInitValues,
      ...(formValues?.post || {}),
    }
    const payload: PostRequest = {
      post: {
        ..._post,
        isLocked: Number(_post.isLocked),
        isDraft: Number(_post.isDraft),
        isHidden: Number(_post.isHidden),
        content: postContent,
      },
      tids: formValues?.tids,
    }
    editPostService.run(payload)
  }
  return (
    <>
      <Row type='flex' justify='center' className={styles.postDetailWrapper}>
        <Col span={24}>
          {getPostService.loading ? (
            <Spin />
          ) : (
            post && (
              <>
                <Form<FormType>
                  ref={formRef}
                  key={key}
                  initValues={formInitValues}
                  onValueChange={(e) => console.log(e)}
                >
                  <Row type='flex' justify='center'>
                    <Banner post={post} />
                    {/* TODO: 标签编辑 */}
                    {/* TODO: 高级设置 */}
                    <Col span={24} xl={18} xxl={16} style={{ position: 'relative' }}>
                      {isAdmin && (
                        <EditArea
                          isEdit={isEdit}
                          loading={editPostService.loading}
                          onChange={setIsEdit}
                          onSave={handleOnSave}
                          onCancel={() => {
                            markdownRef.current?.refresh()
                            setIsEdit(false)
                          }}
                          onDelete={deletePostService.run}
                        />
                      )}
                      {Content}
                    </Col>
                  </Row>
                </Form>

                <Divider className={styles.divider} />
                <Action post={post} />
                <CommentBox post={post} />
                <CommentList postComments={post.postComments} />

                {/* TODO: 评论区 */}
              </>
            )
          )}
        </Col>
      </Row>
      <ScrollTop />
    </>
  )
})
export default PostDetail
