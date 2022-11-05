import React, { useEffect } from 'react'
import { Avatar, Dropdown, Nav as SemiNav } from '@douyinfe/semi-ui'
import { NavProps as SemiNavProps } from '@douyinfe/semi-ui/lib/es/navigation'
import { useSelector } from 'react-redux'
import { RootState, store } from '@/store'
import { Location } from 'history'
import { PathName } from '@/routes'

interface NavProps extends SemiNavProps {
  location: Location
}

const Nav = React.memo<NavProps>(({ location, ...props }) => {
  const state = useSelector((state: RootState) => state.common)
  const dispatch = useSelector(() => store.dispatch.common)

  return (
    <SemiNav
      mode='horizontal'
      header={{
        // logo: <img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />,
        text: state.appBarTitle,
      }}
      footer={
        <Dropdown
          position='bottomRight'
          render={
            <Dropdown.Menu>
              <Dropdown.Item>详情</Dropdown.Item>
              <Dropdown.Item>退出</Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <Avatar size='small' color='light-blue' style={{ margin: 4 }}>
            BD
          </Avatar>
          <span>Bytedancer</span>
        </Dropdown>
      }
      {...props}
    />
  )
})
export default Nav
