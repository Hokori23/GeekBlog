import React, { useState } from 'react'
import { AssociatedPostComment } from '@/utils/Request/PostComment'
import { Button, ButtonGroup, Dropdown, Popconfirm, SplitButtonGroup } from '@douyinfe/semi-ui'
import useAuth from '@/hooks/useAuth'
import { RootState, store } from '@/store'
import { useSelector } from 'react-redux'
import { useRequest } from 'ahooks'
import { PostComment } from '@/utils/Request'
import { CodeDictionary } from '@/utils/Request/type'
import { IconAlertTriangle, IconDelete, IconTreeTriangleDown } from '@douyinfe/semi-icons'
import { menu } from '@milkdown/plugin-menu'

interface CommentActionProps {
  comment: AssociatedPostComment
}

const CommentAction = React.memo<CommentActionProps>(({ comment }) => {
  const { isLogin, userInfo } = useSelector((state: RootState) => state.common)
  const { post } = useSelector((state: RootState) => state.postDetail)
  const dispatch = useSelector(() => store.dispatch.postDetail)

  const isCommentOwner = isLogin && userInfo?.id === comment.author?.id
  const { isAdmin } = useAuth()
  const deleteAble = isCommentOwner || isAdmin

  const [moreBtnShow, setMoreBtnShow] = useState(false)
  const [deletePopConfirmShow, setDeletePopConfirmShow] = useState(false)

  const deleteCommentService = useRequest(
    async () => {
      if (!post) {
        // TODO 上报错误
        console.error('Post不存在')
        return
      }
      const res = await PostComment.Delete(comment.id)
      if (res?.code === CodeDictionary.SUCCESS) {
        dispatch.setPost({
          ...post,
          postComments: post?.postComments?.filter((_comment) => _comment.id !== comment.id) || [],
        })
      }
    },
    {
      manual: true,
    },
  )

  return (
    <SplitButtonGroup>
      <Button type='primary' theme='solid' onClick={() => dispatch.setReplyCommentBox(comment)}>
        回复
      </Button>
      {isAdmin && (
        <Dropdown
          onVisibleChange={setMoreBtnShow}
          trigger='click'
          position='bottomRight'
          onClickOutSide={() => setDeletePopConfirmShow(false)}
          render={
            <Dropdown.Menu>
              {deleteAble && (
                <Dropdown.Item
                  icon={<IconDelete />}
                  type='danger'
                  onClick={() => setDeletePopConfirmShow(true)}
                >
                  <Popconfirm
                    title='警告'
                    visible={deletePopConfirmShow}
                    content='确定要删除该评论吗'
                    onConfirm={() => deleteCommentService.run()}
                    onCancel={() => setDeletePopConfirmShow(false)}
                    okType='danger'
                    trigger='custom'
                    zIndex={9999}
                    position='bottomLeft'
                    icon={
                      <IconAlertTriangle
                        style={{ color: 'var(--semi-color-danger)' }}
                        size='extra-large'
                      />
                    }
                  >
                    删除
                  </Popconfirm>
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          }
        >
          <Button
            style={
              moreBtnShow
                ? { background: 'var(--semi-color-primary-hover)', padding: '8px 4px' }
                : { padding: '8px 4px' }
            }
            theme='solid'
            icon={<IconTreeTriangleDown />}
          />
        </Dropdown>
      )}
    </SplitButtonGroup>
  )
})

export default CommentAction
