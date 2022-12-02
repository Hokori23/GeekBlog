import React, { useEffect, Suspense, useState, useMemo } from 'react'
import { useMobileSize } from '@/hooks/useScreenSize'
import { Layout, Nav as SemiNav } from '@douyinfe/semi-ui'
import { IconHome, IconArticle, IconComment, IconBookmark } from '@douyinfe/semi-icons'
import { useSelector } from 'react-redux'
import { store } from '@/store'
import useInit from '@/hooks/useInit'
import { RouteName, routesMap } from '@/routes'
import { PathName } from '@/routes'

// Components
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import PageLoading from '@/components/PageLoading'
import ErrorBoundary from '@/components/ErrorBoundary'
import { Outlet, useLocation, useNavigate } from 'react-router'

const { Header, Sider, Content } = Layout

const MainLayout = React.memo(() => {
  const navigate = useNavigate()
  const location = useLocation()
  const isMobileSize = useMobileSize()
  const [collapsed, setCollapsed] = useState(isMobileSize)

  const dispatch = useSelector(() => store.dispatch.common)
  const { getBlogConfigService } = useInit()

  const menu = useMemo(() => {
    return [
      {
        itemKey: routesMap[PathName.HOME].menuKey,
        path: PathName.HOME,
        text: RouteName.HOME,
        icon: <IconHome size='large' />,
      },
      {
        itemKey: routesMap[PathName.POST_OVERVIEW].menuKey,
        path: PathName.POST_OVERVIEW,
        text: RouteName.POST,
        icon: <IconArticle size='large' />,
      },
      {
        // itemKey: routesMap[PathName.MOMENT_OVERVIEW].menuKey,
        text: RouteName.MOMENT,
        icon: <IconComment size='large' />,
      },
      {
        // itemKey: routesMap[PathName.POST_TAG].menuKey,
        text: RouteName.POST_TAG,
        icon: <IconBookmark size='large' />,
      },
    ]
  }, [])

  useEffect(() => {
    if (location.pathname === PathName._HOME) {
      navigate(PathName.HOME, {
        replace: true,
      })
    }
    dispatch.checkLogin(null) // 判断登陆态合法性
  }, [])

  useEffect(() => {
    setCollapsed(isMobileSize)
  }, [isMobileSize])

  return (
    <Layout className='layout'>
      <Header>
        <Nav />
      </Header>

      <Layout>
        <Sider>
          <SemiNav
            selectedKeys={[routesMap[location.pathname]?.menuKey]}
            style={{ maxWidth: 220, height: '100%' }}
            isCollapsed={collapsed}
            onClick={({ itemKey }) =>
              navigate(menu.find((menuItem) => menuItem.itemKey === itemKey)?.path as string)
            }
            onCollapseChange={setCollapsed}
            items={menu}
            footer={{
              collapseButton: true,
            }}
          />
        </Sider>
        <Content style={{ position: 'relative' }}>
          <PageLoading show={getBlogConfigService.loading} />
          <ErrorBoundary>
            <Suspense fallback={<PageLoading />}>
              <div id='right-content' style={{ height: 'calc(100vh - 60px)', overflowY: 'auto' }}>
                <Outlet />
                <Footer />
              </div>
            </Suspense>
          </ErrorBoundary>
        </Content>
      </Layout>
    </Layout>
  )
})

export default MainLayout
