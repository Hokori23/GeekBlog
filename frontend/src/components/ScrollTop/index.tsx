import { BackTop, Button } from '@douyinfe/semi-ui'
import { IconArrowUp } from '@douyinfe/semi-icons'
import React from 'react'
import { BackTopProps } from '@douyinfe/semi-ui/lib/es/backtop'
import { $ } from '@/utils/tools'

const ScrollTop = React.memo<BackTopProps>((props) => (
  <BackTop
    visibilityHeight={500}
    target={() => $('#right-content')}
    {...props}
    style={{
      bottom: 100,
      // right: 20,
    }}
  >
    <Button
      theme='solid'
      size='large'
      icon={<IconArrowUp color='primary' />}
      style={{ borderRadius: '50%' }}
    />
  </BackTop>
))

export default ScrollTop
