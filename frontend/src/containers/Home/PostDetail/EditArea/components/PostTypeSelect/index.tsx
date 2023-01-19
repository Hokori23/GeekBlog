import React, { useMemo } from 'react'
import { PostType } from '@/utils/Request/Post'
import { Form } from '@douyinfe/semi-ui'
import { useMobileSize } from '@/hooks/useScreenSize'

export const PostTypeLabel = {
  [PostType.POST]: '帖子',
  [PostType.LANDSCAPE]: '沉浸式背景',
  [PostType.PAGE]: '自定义页面',
}

const PostTypeSelect = React.memo(() => {
  const isMobileSize = useMobileSize()
  const optionList = useMemo(
    () => [
      {
        label: PostTypeLabel[PostType.POST],
        value: PostType.POST,
      },
      {
        label: PostTypeLabel[PostType.LANDSCAPE],
        value: PostType.LANDSCAPE,
      },
      {
        label: PostTypeLabel[PostType.PAGE],
        value: PostType.PAGE,
      },
    ],
    [],
  )
  return (
    <Form.Select
      field='post.type'
      insetLabel='类型'
      size={isMobileSize ? 'small' : 'default'}
      noLabel={true}
      optionList={optionList}
      style={{
        width: 150,
      }}
    />
  )
})

export default PostTypeSelect
