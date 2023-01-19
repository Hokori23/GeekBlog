import React, { useMemo } from 'react'
import { Divider, Space, TagGroup, Tooltip, Typography } from '@douyinfe/semi-ui'
import { AssociatedPost } from '@/utils/Request/Post'
import styles from './index.module.scss'
import { setUpYunImg } from '@/utils/tools'
import classnames from 'classnames'
import { formatDistanceToNow, format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { TagGroupProps, TagProps } from '@douyinfe/semi-ui/lib/es/tag'

const { Title, Text } = Typography

interface BannerProps {
  post: AssociatedPost
}

const Banner = React.memo<BannerProps>(({ post }) => {
  const { title, coverUrl, author, createdAt, pageViews, postComments, tags } = post

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
  const tagList: TagGroupProps<TagProps>['tagList'] = useMemo(
    () =>
      // TODO: 适配Semi
      tags?.map(({ name, iconColor }) => ({
        type: coverUrl ? 'solid' : 'ghost',
        children: name,
        // color: iconColor,
      })),
    [tags],
  )

  const bannerBg = useMemo(
    () =>
      coverUrl && (
        <figure className={styles.bannerBg}>
          <img src={setUpYunImg(coverUrl, 'md')} />
        </figure>
      ),
    [coverUrl],
  )

  return (
    <header className={styles.bannerWrapper}>
      {bannerBg}
      <figure
        className={classnames({
          [styles.bannerTextWrapper]: true,
          [styles['bannerTextWrapper--noBg']]: !coverUrl,
        })}
      >
        <Title className={styles.title}>{title}</Title>
        <Space>
          <Text link>{author.userName}</Text>
          <Divider layout='vertical' />
          <Text>访问数: {pageViews}</Text>
          <Divider layout='vertical' />
          <Text>评论数: {postComments?.length || 0}</Text>
        </Space>
        <Space style={{ marginTop: 8 }}>
          <Tooltip content={_createdAtDistance} position='right'>
            <Text>发布时间: {_createdAtReadable}</Text>
          </Tooltip>
        </Space>
        {Boolean(tagList?.length) && (
          <Space style={{ marginTop: 8 }}>
            <TagGroup
              key='tags'
              showPopover
              maxTagCount={3}
              tagList={tagList}
              size='large'
              style={{ marginLeft: 8 }}
            />
          </Space>
        )}
      </figure>
    </header>
  )
})

export default Banner
