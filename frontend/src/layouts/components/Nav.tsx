import React, { useEffect, useMemo } from 'react'
import { Avatar, Dropdown, Modal, Nav as SemiNav } from '@douyinfe/semi-ui'
import { DropdownProps } from '@douyinfe/semi-ui/lib/es/dropdown'
import { NavProps as SemiNavProps } from '@douyinfe/semi-ui/lib/es/navigation'
import { useSelector } from 'react-redux'
import { RootState, store } from '@/store'
import { Location } from 'history'
import { PathName, RouteName } from '@/routes'
import { Group } from '@/utils/Request/User'
import { useHistory, useLocation } from 'react-router-dom'

const Nav = React.memo<SemiNavProps>(({ ...props }) => {
  const location = useLocation()
  const history = useHistory()
  const state = useSelector((state: RootState) => state.common)
  const dispatch = useSelector(() => store.dispatch.common)

  const { isLogin, userInfo } = state
  const isAdmin = useMemo(() => (userInfo?.group || 0) > Group.SUBSCRIBER, [userInfo?.group])
  const inAdminPage = useMemo(
    () => location.pathname.startsWith(PathName.ADMIN),
    [location.pathname],
  )
  const blogName = useMemo(
    () => state.blogConfig?.find((v) => v.module === 'system' && v.key === 'blogName')?.value,
    [state.blogConfig],
  )

  const handleLogOut = () => {
    Modal.info({
      title: '提示',
      content: '确定要退出登录？',
      onOk: () => {
        dispatch.logOut()
      },
    })
  }

  const dropdownMenu = useMemo(() => {
    const menu: DropdownProps['menu'] = [
      {
        node: 'item',
        name: RouteName.HOME,
        active: !inAdminPage,
        onClick: () => history.push(PathName.HOME),
      },
    ]
    isAdmin &&
      menu.push({
        node: 'item',
        name: RouteName.ADMIN,
        active: inAdminPage,
        onClick: () => history.push(PathName.ADMIN),
      })
    menu.push(
      {
        node: 'item',
        name: RouteName.USER,
        onClick: () => history.push(PathName.USER),
      },
      {
        node: 'divider',
      },
    )
    isLogin
      ? menu.push({
          node: 'item',
          name: '退出登录',
          onClick: handleLogOut,
        })
      : menu.push(
          {
            node: 'item',
            name: '登录',
            onClick: () => history.push(PathName.LOGIN),
          },
          {
            node: 'item',
            name: '注册',
            onClick: () => history.push(PathName.REGISTER),
          },
        )
    return menu
  }, [isLogin])

  return (
    <SemiNav
      mode='horizontal'
      header={{
        // logo: <img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />,
        text: blogName,
      }}
      footer={
        <Dropdown position='bottomRight' menu={dropdownMenu}>
          <Avatar alt={userInfo.userName} size='small' src={userInfo.avatarUrl} />
        </Dropdown>
      }
      {...props}
    />
  )
})
export default Nav
