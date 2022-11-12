import React, { useMemo } from 'react'
import { Divider, Space, Tooltip, Typography } from '@douyinfe/semi-ui'
import { PostWithAuthor } from '@/utils/Request/Post'
import styles from './index.module.scss'
import { setUpYunImg } from '@/utils/tools'
import classnames from 'classnames'
import { formatDistanceToNow, format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import useAuth from '@/hooks/useAuth'

const { Title, Text } = Typography

const Banner = React.memo<{ post: PostWithAuthor; onEditMode: (isEdit: boolean) => void }>(
  ({ post, onEditMode }) => {
    const { title, coverUrl, author, createdAt, pageViews, postComments } = post
    const { isAdmin } = useAuth()

    const { _createdAtReadable, _createdAtDistance } = useMemo(
      () => ({
        _createdAtReadable: format(new Date(createdAt), 'yyyy/MM/dd HH:mm'),
        _createdAtDistance: formatDistanceToNow(new Date(createdAt), {
          locale: zhCN,
          addSuffix: true,
        }),
      }),
      [createdAt],
    )

    return (
      <header className={styles.bannerWrapper}>
        {coverUrl && (
          <figure className={styles.bannerBg}>
            <img src={setUpYunImg(coverUrl, 'md')} />
          </figure>
        )}
        <figure
          className={classnames({
            [styles.bannerTextWrapper]: true,
            [styles['bannerTextWrapper--noBg']]: !coverUrl,
          })}
        >
          <Title style={{ marginBottom: 16, fontSize: 48, fontWeight: 500 }}>{title}</Title>
          <Space style={{ marginBottom: 8 }}>
            <Text link>{author.userName}</Text>
            <Divider layout='vertical' />
            <Text>访问数: {pageViews}</Text>
            <Divider layout='vertical' />
            <Text>评论数: {postComments?.length || 0}</Text>
          </Space>
          <Space>
            <Tooltip content={_createdAtDistance} position='right'>
              <Text>发布时间: {_createdAtReadable}</Text>
            </Tooltip>
            {isAdmin && (
              <>
                <Divider layout='vertical' />
                <Text link onClick={() => onEditMode(true)}>
                  编辑
                </Text>
              </>
            )}
          </Space>
        </figure>
      </header>
    )
  },
)

export default Banner