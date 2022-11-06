import React, { useEffect, Suspense } from 'react'
import { Layout } from '@douyinfe/semi-ui'
import useInitBlogConfig from '@/hooks/useInitBlogConfig'
import PageLoading from '@/components/PageLoading'
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
  const { location, history } = props

  const { loading: loadingBlogConfig, cancel } = useInitBlogConfig()

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
