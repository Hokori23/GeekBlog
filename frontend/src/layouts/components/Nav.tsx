import React, { useCallback, useMemo } from 'react'
import {
  Avatar,
  Dropdown,
  Modal,
  Nav as SemiNav,
  ButtonGroup,
  Button,
  Typography,
} from '@douyinfe/semi-ui'
import { DropdownProps } from '@douyinfe/semi-ui/lib/es/dropdown'
import { NavProps as SemiNavProps } from '@douyinfe/semi-ui/lib/es/navigation'
import { useSelector } from 'react-redux'
import { RootState, store } from '@/store'
import { PathName, RouteName } from '@/routes'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'

const { Title } = Typography

const Nav = React.memo<SemiNavProps>((props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isLogin, userInfo, blogConfig } = useSelector((state: RootState) => state.common)
  const dispatch = useSelector(() => store.dispatch.common)

  const { isAdmin } = useAuth()
  const inAdminPage = useMemo(
    () => location.pathname.startsWith(PathName.ADMIN),
    [location.pathname],
  )
  const inUserPage = useMemo(() => location.pathname.startsWith(PathName.USER), [location.pathname])
  const blogName = useMemo(
    () => blogConfig?.find((v) => v.module === 'system' && v.key === 'blogName')?.value,
    [blogConfig],
  )

  const handleLogOut = useCallback(() => {
    Modal.info({
      title: '提示',
      content: '确定要退出登录？',
      onOk: () => {
        dispatch.logOut()
      },
    })
  }, [dispatch])

  const header = useMemo(
    () => (
      <Title heading={5} link onClick={() => navigate(PathName.HOME)}>
        {blogName}
      </Title>
    ),
    [blogName, navigate],
  )

  const dropdownMenu = useMemo(() => {
    const menu: DropdownProps['menu'] = [
      isAdmin
        ? {
            node: 'item',
            name: RouteName.ADMIN,
            active: inAdminPage,
            onClick: () => !inAdminPage && navigate(PathName.ADMIN),
          }
        : {
            node: 'item',
            name: RouteName.HOME,
            active: !inAdminPage,
            onClick: () => inAdminPage && navigate(PathName.HOME),
          },
      {
        node: 'item',
        active: inUserPage,
        name: RouteName.USER,
        onClick: () => !inUserPage && navigate(PathName.USER),
      },
      {
        node: 'divider',
      },
      {
        node: 'item',
        name: '退出登录',
        onClick: handleLogOut,
      },
    ]
    return menu
  }, [isAdmin, inUserPage, inAdminPage])

  const footer = useMemo(
    () =>
      isLogin ? (
        <Dropdown position='bottomRight' menu={dropdownMenu}>
          <Avatar
            alt={userInfo?.userName}
            size='small'
            src={userInfo?.avatarUrl}
            style={{ marginRight: 12 }}
          />
        </Dropdown>
      ) : (
        <ButtonGroup>
          <Button theme='solid' onClick={() => navigate(PathName.LOGIN)}>
            登录
          </Button>
          <Button onClick={() => navigate(PathName.REGISTER)}>注册</Button>
        </ButtonGroup>
      ),
    [isLogin],
  )

  return (
    <SemiNav
      mode='horizontal'
      header={{
        // logo: <img src="https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/webcast_logo.svg" />,
        text: header,
      }}
      footer={footer}
      {...props}
    />
  )
})
export default Nav
