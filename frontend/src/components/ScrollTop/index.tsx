import { BackTop, Button } from '@douyinfe/semi-ui'
import { IconArrowUp } from '@douyinfe/semi-icons'
import React from 'react'
import { BackTopProps } from '@douyinfe/semi-ui/lib/es/backtop'
import { $ } from '@/utils/tools'
import { useMobileSize } from '@/hooks/useScreenSize'

const ScrollTop = React.memo<BackTopProps>((props) => {
  const isMobileSize = useMobileSize()
  return (
    <BackTop
      visibilityHeight={500}
      target={() => $('#right-content')}
      {...props}
      style={{
        bottom: isMobileSize ? 75 : 100,
        right: isMobileSize ? 20 : 100,
      }}
    >
      <Button
        theme='solid'
        size='large'
        icon={<IconArrowUp color='primary' />}
        style={{ borderRadius: '50%' }}
      />
    </BackTop>
  )
})

export default ScrollTop
