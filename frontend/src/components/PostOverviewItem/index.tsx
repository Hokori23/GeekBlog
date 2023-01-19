import React, { useMemo } from 'react'
import { AssociatedPost } from '@/utils/Request/Post'
import {
  Collapsible,
  List,
  Typography,
  Card,
  Avatar,
  Tooltip,
  Badge,
  TagGroup,
} from '@douyinfe/semi-ui'
import { IconBackTop, IconEyeOpened, IconComment } from '@douyinfe/semi-icons'
import { TagGroupProps, TagProps } from '@douyinfe/semi-ui/lib/es/tag'
import { format, formatDistanceToNow } from 'date-fns'
import Image from '@/components/Image'
import { zhCN } from 'date-fns/locale'
import styles from './index.module.scss'
import Markdown from '@/components/Markdown/Editor'
import { useMobileSize } from '@/hooks/useScreenSize'
import classnames from 'classnames'

const { Title: SemiTitle } = Typography
const { Meta } = Card

interface PostOverviewItemProps {
  post: AssociatedPost
  onClick: () => void
}
const PostOverviewItem = React.memo<PostOverviewItemProps>(({ post, onClick }) => {
  const { coverUrl, title, content, author, createdAt, priority, pageViews, postComments, tags } =
    post

  const isMobileSize = useMobileSize()

  const tagList: TagGroupProps<TagProps>['tagList'] = useMemo(
    () =>
      // TODO: 适配Semi
      tags?.map(({ name, iconColor }) => ({
        type: 'ghost',
        children: name,
        // color: iconColor,
      })),
    [tags],
  )

  const Cover = useMemo(
    () =>
      coverUrl && (
        <div className={styles.imgContainer} onClick={(e) => e.stopPropagation()}>
          {/* TODO-bug: diff复用节点, loading态时依旧展示上一张图片 */}
          <Image src={coverUrl} className={styles.img} />
        </div>
      ),
    [coverUrl],
  )

  const Title = useMemo(
    () =>
      title && (
        <SemiTitle heading={isMobileSize ? 3 : 1} className={styles.title}>
          {title}
          {Boolean(priority) && <IconBackTop size='extra-large' className={styles.topIcon} />}
        </SemiTitle>
      ),
    [title, priority, isMobileSize],
  )

  const Actions = useMemo(
    () => [
      <Badge key='pageViews' count={pageViews} overflowCount={99}>
        <Avatar size='extra-small' style={{ backgroundColor: 'transparent' }}>
          <IconEyeOpened size='extra-large' style={{ color: 'var(--semi-color-text-2)' }} />
        </Avatar>
      </Badge>,
      <Badge key='postComments' count={postComments?.length} overflowCount={99}>
        <Avatar size='extra-small' style={{ backgroundColor: 'transparent', marginLeft: 8 }}>
          <IconComment size='extra-large' style={{ color: 'var(--semi-color-text-2)' }} />
        </Avatar>
      </Badge>,
      <TagGroup
        key='tags'
        showPopover
        maxTagCount={3}
        tagList={tagList}
        size='large'
        style={{ marginLeft: 8 }}
      />,
    ],
    [pageViews, postComments?.length, tagList],
  )

  const Description = useMemo(
    () => (
      <Tooltip
        content={formatDistanceToNow(new Date(createdAt), {
          locale: zhCN,
          addSuffix: true,
        })}
      >
        {format(new Date(createdAt), 'yyyy/MM/dd hh:mm')}
      </Tooltip>
    ),
    [createdAt],
  )

  const { _content, needEllipsis, overviewContent } = useMemo(() => {
    const _content = content
      .replaceAll(
        /!\[(.*?)\]\(((https?:)\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])\)/g,
        '',
      )
      .replaceAll(/[\<\/?photos\>]/g, '')
      .replaceAll('\n', '')
    return {
      _content,
      needEllipsis: _content.length > 256,
      overviewContent: content.slice(0, 256),
    }
  }, [content])

  const ContentComponent = useMemo(
    () =>
      _content &&
      (needEllipsis ? (
        <Collapsible
          isOpen={false}
          collapseHeight={300}
          className={styles.contentContainer__collapsed}
        >
          <Markdown defaultValue={overviewContent} readOnly={true} />
        </Collapsible>
      ) : (
        <Markdown defaultValue={overviewContent} readOnly={true} />
      )),
    [overviewContent, _content, needEllipsis],
  )

  return (
    <List.Item
      className={classnames(styles.postOverviewItem, {
        [styles['postOverviewItem--mobile']]: isMobileSize,
      })}
      onClick={onClick}
      main={
        <Card
          shadows={isMobileSize ? undefined : 'hover'}
          className={styles.body}
          cover={Cover}
          title={Title}
          actions={Actions}
        >
          <Meta
            style={{ marginBottom: 12 }}
            title={author.userName}
            description={Description}
            avatar={<Avatar alt={author.userName} size='default' src={author.avatarUrl} />}
          />
          <div className={styles.contentContainer}>{ContentComponent}</div>
        </Card>
      }
    />
  )
})

export default PostOverviewItem
