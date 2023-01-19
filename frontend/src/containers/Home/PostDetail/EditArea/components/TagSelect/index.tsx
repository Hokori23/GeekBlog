import { FormRemoteSelect } from '@/components/RemoteSelect'
import { PostTag } from '@/utils/Request'
import React from 'react'

const TagSelect = React.memo(() => {
  const getAllTagsOptionList = async () => {
    const res = await PostTag.RetrieveAll()
    if (!res?.data) {
      return []
    }
    return res?.data?.map((tag) => ({
      label: tag.name,
      value: tag.id,
    }))
  }

  return (
    <FormRemoteSelect
      field='tids'
      noLabel={true}
      multiple={true}
      insetLabel='标签'
      api={getAllTagsOptionList}
      style={{ width: 150 }}
    />
  )
})

export default TagSelect
