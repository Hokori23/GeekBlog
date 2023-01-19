import React, { FC, useMemo, useRef, useState } from 'react'
import { Button, Col, Row, ButtonGroup, Popconfirm, Modal, Divider } from '@douyinfe/semi-ui'
import { useNavigate } from 'react-router-dom'
import { PathName } from '@/routes'
import useUrlParams from '@/hooks/useUrlParams'
import styles from './index.module.scss'
import useAuth from '@/hooks/useAuth'
import useRequest from './useRequest'
import { IconAlertTriangle } from '@douyinfe/semi-icons'
import { useMobileSize } from '@/hooks/useScreenSize'
import classnames from 'classnames'

// components
import ScrollTop from '@/components/ScrollTop'
import Spin from '@/components/Spin'
import Banner from './Banner'
import Action from './Action'
import CommentBox from './CommentBox'
import CommentList from './CommentList'
import Markdown, { EditorHandler } from '@/components/Markdown/Editor'

const PostDetail = React.memo(() => {
  const navigate = useNavigate()
  const { urlParams } = useUrlParams<{ id: string }>()
  const isMobileSize = useMobileSize()
  const { id } = urlParams
  const { isAdmin } = useAuth()
  const [isEdit, setIsEdit] = useState(false)

  const { getPostService, editPostService, deletePostService, post } = useRequest({
    id: Number(id),
    onSave: () => setIsEdit(false),
    onDelete: () => navigate(PathName.HOME),
  })

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

  const buttonSize = isMobileSize ? 'small' : 'default'

  const EditGroupButton = useMemo(() => {
    if (isEdit) {
      return (
        <>
          <Button
            theme='solid'
            size={buttonSize}
            loading={editPostService.loading}
            disabled={!isAdmin}
            onClick={() => editPostService.run(markdownRef.current?.getValue() || '')}
          >
            保存
          </Button>
          <Button
            size={buttonSize}
            disabled={editPostService.loading || !isAdmin}
            onClick={() => {
              markdownRef.current?.refresh()
              setIsEdit(false)
            }}
          >
            取消
          </Button>
        </>
      )
    }

    return (
      <>
        <Button size={buttonSize} theme='solid' onClick={() => setIsEdit(true)}>
          编辑
        </Button>
        {isMobileSize ? (
          <Button
            size={buttonSize}
            theme='light'
            type='danger'
            onClick={() =>
              Modal.error({
                size: 'full-width',
                title: '确定要删除此文章？',
                content: '此修改将不可逆',
                onOk: () => {},
              })
            }
          >
            删除
          </Button>
        ) : (
          <Popconfirm
            title='确定要删除此文章？'
            content='此修改将不可逆'
            okType='danger'
            icon={
              <IconAlertTriangle style={{ color: 'var(--semi-color-danger)' }} size='extra-large' />
            }
            position='leftTop'
            onConfirm={deletePostService.run}
          >
            <Button size={buttonSize} theme='light' type='danger'>
              删除
            </Button>
          </Popconfirm>
        )}
      </>
    )
  }, [isAdmin, isEdit, isMobileSize, getPostService.loading, editPostService.loading, buttonSize])

  return (
    <>
      <Row type='flex' justify='center' className={styles.postDetailWrapper}>
        <Col span={24}>
          {getPostService.loading ? (
            <Spin />
          ) : (
            post && (
              <>
                <Row type='flex' justify='center'>
                  <Banner post={post} />
                  {/* TODO: 标签编辑 */}
                  {/* TODO: 高级设置 */}
                  <Col span={24} xl={18} xxl={16} style={{ position: 'relative' }}>
                    {isAdmin && (
                      <ButtonGroup
                        className={classnames({
                          [styles['action-btns']]: true,
                          [styles['action-btns__edit']]: isEdit,
                        })}
                      >
                        {EditGroupButton}
                      </ButtonGroup>
                    )}
                    {Content}
                  </Col>
                </Row>
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
