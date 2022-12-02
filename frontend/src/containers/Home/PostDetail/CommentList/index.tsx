import React, { useEffect, useMemo, useState } from 'react'
import { AssociatedPostComment } from '@/utils/Request/PostComment'
import { Avatar, Col, List, Row, Typography } from '@douyinfe/semi-ui'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import CommentAction from './CommentAction'
import { isNil } from 'lodash-es'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import ReplyCommentBox from './ReplyCommentBox'

const { Title, Text, Paragraph } = Typography

/**
  interface PostComment {
    id: number
    rootId?: number // 一级评论id
    parentId?: number // 二级评论id
    pid: number
    uid: number
    content: string
    email: string
    url?: string
    ip: string
    userAgent?: string
    likesCount: number
    dislikesCount: number
    readonly createdAt: Date
    readonly updatedAt: Date
  }
 */
/**
 * 评论列表
 * 1. 一级评论, 无rootId, 无parentId
 * 2. 二级评论, 有rootId, 有parentId, 且rootId = parentId, 回复一级评论
 * 3. 三级评论, 有rootId, 有parentId, 回复二级评论
 */

interface CommentItemProps extends AssociatedPostComment {
  parent?: AssociatedPostComment
  children?: AssociatedPostComment[] & { children: AssociatedPostComment[] }
  level?: number
}

const CommentItem = React.memo<CommentItemProps>(({ level = 0, ...comment }) => {
  const name = comment.author?.userName || comment.email
  const parentName = comment.parent?.author?.userName || comment.parent?.email
  const { replyComment } = useSelector((state: RootState) => state.postDetail)
  const [isInitReplyComment, setIsInitReplyComment] = useState(false) // 懒加载评论组件
  useEffect(() => {
    if (replyComment?.id === comment.id) {
      setIsInitReplyComment(true)
    }
  }, [replyComment])

  return (
    <>
      <List.Item
        style={{
          paddingLeft: level > 0 ? 12 + 68 : 12, // 非根级评论进行缩进
        }}
        header={
          <Avatar alt={name} src={comment.author?.avatarUrl}>
            {name.slice(0, 2)}
          </Avatar>
        }
        main={
          <div>
            <Title heading={6}>{name}</Title>
            <Row type='flex' align='middle' style={{ marginBottom: 4 }}>
              {comment.parent && (
                <Text type='tertiary' component='div' style={{ marginRight: 4 }}>
                  回复
                  {/* TODO: 如果回复对象是注册用户, 可以跳转到用户页面 */}
                  <Text link={!!comment.parent?.author} type='primary'>
                    @{parentName}
                  </Text>
                </Text>
              )}
              <Text>{comment.content}</Text>
            </Row>
            <Paragraph size='small'>
              {formatDistanceToNow(new Date(comment.createdAt), {
                locale: zhCN,
                addSuffix: true,
              })}
            </Paragraph>
          </div>
        }
        extra={<CommentAction comment={comment} />}
      />
      {isInitReplyComment && <ReplyCommentBox show={replyComment?.id === comment.id} />}
      {comment.children?.map((_comment) => (
        <CommentItem key={_comment.id} level={level + 1} {..._comment} />
      ))}
    </>
  )
})

interface CommentListProps {
  postComments?: AssociatedPostComment[]
}

const CommentList = React.memo<CommentListProps>(({ postComments }) => {
  const formatPostComments = useMemo(() => {
    let rootComments: AssociatedPostComment[] = []
    let secondLevelComments: AssociatedPostComment[] = []
    const thirdLevelComments: AssociatedPostComment[] = []
    postComments?.forEach((comment) => {
      if (isNil(comment.rootId)) {
        rootComments.push(comment)
      } else if (comment.parentId === comment.rootId) {
        secondLevelComments.push(comment)
      } else {
        thirdLevelComments.push(comment)
      }
    })

    secondLevelComments = secondLevelComments.map((secondLevelComment) => ({
      ...secondLevelComment,
      children: thirdLevelComments
        .map((thirdLevelComment) => {
          if (thirdLevelComment.parentId === secondLevelComment.id) {
            return {
              ...thirdLevelComment,
              parent: secondLevelComment,
            }
          }
          return null
        })
        .filter((v) => !!v),
    }))
    rootComments = rootComments.map((rootComment) => ({
      ...rootComment,
      children: secondLevelComments.filter(
        (secondLevelComment) => secondLevelComment.rootId === rootComment.id,
      ),
    }))

    return rootComments
  }, [postComments])

  return (
    <Row type='flex' justify='center' style={{ marginBottom: 20 }}>
      <Col span={18} xl={14} xxl={12} style={{ position: 'relative' }}>
        <List
          dataSource={formatPostComments || []}
          renderItem={(comment) => <CommentItem {...comment} />}
        />
      </Col>
    </Row>
  )
})

export default CommentList
