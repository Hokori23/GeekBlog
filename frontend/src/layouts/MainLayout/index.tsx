import React, { useEffect, Suspense } from 'react'
import { useMobileSize } from '@/hooks/useScreenSize'
import { Layout, Nav as SemiNav } from '@douyinfe/semi-ui'
import { IconHome, IconArticle, IconComment, IconBookmark } from '@douyinfe/semi-icons'
import { useSelector } from 'react-redux'
import { RootState, store } from '@/store'
import useInitBlogConfig from '@/hooks/useInitBlogConfig'
import PageLoading from '@/components/PageLoading'
import { RouteName, routesMap } from '@/routes'

// Components
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { PathName } from '@/routes'
import { LayoutProps } from '../types'

const { Header, Footer: SemiFooter, Sider, Content } = Layout

const MainLayout = React.memo<LayoutProps>(({ Component, ...props }) => {
  const { routes, location, history } = props
  const isMobileSize = useMobileSize()

  const state = useSelector((state: RootState) => state.common)
  const dispatch = useSelector(() => store.dispatch.common)
  const { loading: loadingBlogConfig } = useInitBlogConfig()

  if (!state.isLogin) {
    // TODO: 重定向登陆页
  }
  useEffect(() => {
    if (location.pathname === PathName._HOME) {
      history.replace(PathName.HOME)
    }
  }, [])

  return (
    <Layout className='layout'>
      <Header>
        <Nav />
      </Header>

      <Layout>
        <Sider>
          <SemiNav
            selectedKeys={[routesMap[location.pathname].menuKey]}
            style={{ maxWidth: 220, height: '100%' }}
            isCollapsed={isMobileSize}
            items={[
              {
                itemKey: routesMap[PathName.HOME].menuKey,
                text: RouteName.HOME,
                icon: <IconHome size='large' />,
              },
              {
                // itemKey: routesMap[PathName.POST_OVERVIEW].menuKey,
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
            ]}
            footer={{
              collapseButton: true,
            }}
          />
        </Sider>
        <Content>
          <PageLoading show={loadingBlogConfig} />
          <Suspense fallback={<PageLoading />}>
            <Component {...props} />
          </Suspense>
        </Content>
      </Layout>
      <SemiFooter>
        <Footer />
      </SemiFooter>
    </Layout>
  )
})

export default MainLayout
