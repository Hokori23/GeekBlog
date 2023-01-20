import React from 'react'
import { Form } from '@douyinfe/semi-ui'
import { useMobileSize } from '@/hooks/useScreenSize'

const PriorityInput = React.memo(() => {
  const isMobileSize = useMobileSize()
  return (
    <Form.InputNumber
      innerButtons
      style={{ width: 100 }}
      field='post.priority'
      placeholder='优先级'
      noLabel={true}
      showClear={true}
      size={isMobileSize ? 'small' : 'default'}
    />
  )
})

export default PriorityInput
