import { store } from '@/store'
import { IconEyeOpened, IconLikeThumb, IconDislikeThumb } from '@douyinfe/semi-icons'
import { Badge, Button, Col, Row } from '@douyinfe/semi-ui'
import classnames from 'classnames'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './index.module.scss'
import { AssociatedPost } from '@/utils/Request/Post'

interface ActionProps {
  post: AssociatedPost
}

const Action = React.memo<ActionProps>(({ post }) => {
  const { pageViews, likesCount, dislikesCount } = post
  const dispatch = useSelector(() => store.dispatch.postDetail)
  const [actionState, setActionState] = useState<null | 'like' | 'dislike'>(null)
  const likeAble = actionState !== 'like'
  const dislikeAble = actionState !== 'dislike'

  // TODO: 后端提供一个类似b站可以互斥点赞点踩的接口

  const Action = [
    {
      key: 'pageViews',
      Component: (
        <Badge count={pageViews} overflowCount={99}>
          <Button
            className={classnames(styles.btn, styles['btn__disabled'])}
            theme='borderless'
            icon={
              <IconEyeOpened size='extra-large' style={{ color: 'var(--semi-color-text-2)' }} />
            }
          />
        </Badge>
      ),
    },
    {
      key: 'likesCount',
      Component: (
        <Badge count={likesCount} overflowCount={99}>
          <Button
            className={styles.btn}
            theme='borderless'
            icon={
              <IconLikeThumb size='extra-large' style={{ color: 'var(--semi-color-text-2)' }} />
            }
          />
        </Badge>
      ),
    },
    {
      key: 'dislikesCount',
      Component: (
        <Badge count={dislikesCount} overflowCount={99}>
          <Button
            className={styles.btn}
            theme='borderless'
            icon={
              <IconDislikeThumb size='extra-large' style={{ color: 'var(--semi-color-text-2)' }} />
            }
          />
        </Badge>
      ),
    },
  ]

  return (
    <Row type='flex' justify='center' style={{ marginBottom: 20 }}>
      {Action.map(({ key, Component }) => {
        return (
          <Col className={styles.action} key={key} span={8} xl={7} xxl={6}>
            <Row type='flex' justify='center'>
              {Component}
            </Row>
          </Col>
        )
      })}
    </Row>
  )
})

export default Action
