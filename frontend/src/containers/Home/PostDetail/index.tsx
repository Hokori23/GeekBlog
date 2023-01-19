import React, { useMemo, useRef, useState } from 'react'
import { Col, Row, Divider, Form } from '@douyinfe/semi-ui'
import { useNavigate } from 'react-router-dom'
import { PathName } from '@/routes'
import useUrlParams from '@/hooks/useUrlParams'
import styles from './index.module.scss'
import useAuth from '@/hooks/useAuth'
import useService from './useService'
import classnames from 'classnames'

// components
import ScrollTop from '@/components/ScrollTop'
import Spin from '@/components/Spin'
import Banner from './Banner'
import Action from './Action'
import CommentBox from './CommentBox'
import CommentList from './CommentList'
import Markdown, { EditorHandler } from '@/components/Markdown/Editor'
import EditArea from './EditArea'
import { EditByAdminRequest, Post } from '@/utils/Request/Post'

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

  const formRef = useRef<Form>(null)
  const markdownRef = useRef<EditorHandler | null>(null)

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

  return (
    <>
      <Row type='flex' justify='center' className={styles.postDetailWrapper}>
        <Col span={24}>
          {getPostService.loading ? (
            <Spin />
          ) : (
            post && (
              <>
                <Form<Partial<EditByAdminRequest>>
                  ref={formRef}
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
                          onSave={() => editPostService.run(markdownRef.current?.getValue() || '')}
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
