import React, { useEffect, Suspense } from 'react'
import { useMobileSize } from '@/hooks/useScreenSize'
import { Layout } from '@douyinfe/semi-ui'
import { useSelector } from 'react-redux'
import { RootState, store } from '@/store'
import useInitBlogConfig from '@/hooks/useInitBlogConfig'
import PageLoading from '@/components/PageLoading'
import { RouteName, routesMap } from '@/routes'
import styles from './index.module.scss'

// Components
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { PathName } from '@/routes'
import { LayoutProps } from '../types'
import Spin from '@/components/Spin'
import { withRouter } from 'react-router-dom'

const { Header, Footer: SemiFooter, Sider, Content } = Layout

const SignLayout = React.memo<LayoutProps>(({ Component, ...props }) => {
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

      <Content style={{ position: 'relative' }}>
        <PageLoading show={loadingBlogConfig} />
        <section className={styles.signContainer}>
          <aside className={styles.banner}>banner TODO</aside>
          <section className={styles.form}>
            <Suspense fallback={<Spin />}>
              <Component {...props} />
            </Suspense>
          </section>
        </section>
      </Content>
      <SemiFooter>
        <Footer />
      </SemiFooter>
    </Layout>
  )
})

export default withRouter(SignLayout)
