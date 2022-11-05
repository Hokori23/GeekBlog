import React, { useEffect } from 'react'
import { LayoutProps } from '../types'
import { useDeskTopSize } from '@/hooks/useScreenSize'
import { Layout } from '@douyinfe/semi-ui'
import { useSelector } from 'react-redux'
import { RootState, store } from '@/store'

// Components
import Nav from '../components/Nav'
import { PathName } from '@/routes'

const { Header, Footer, Sider, Content } = Layout

const MainLayout = React.memo<LayoutProps>(({ Component, ...props }) => {
  const { routes, location, history } = props
  const isDeskTopSize = useDeskTopSize()

  const state = useSelector((state: RootState) => state.common)
  const dispatch = useSelector(() => store.dispatch.common)

  if (!state.isLogin) {
    // TODO: 重定向登陆页
  }
  useEffect(() => {
    if (location.pathname === PathName._HOME) {
      history.replace(PathName.HOME)
    }
  }, [])

  // if (location.pathname === PathName._HOME) {
  //   return null
  // }

  return (
    <Layout className='layout'>
      <Header>
        <Nav location={location} />
      </Header>
      <Layout>
        <Sider>Sider</Sider>
        <Content>
          <Component {...props} />
        </Content>
      </Layout>
      <Footer>Footer</Footer>
    </Layout>
  )
})

export default MainLayout
