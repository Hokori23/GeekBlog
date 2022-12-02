import React, { useEffect } from 'react'
import { Layout } from '@douyinfe/semi-ui'
import useInit from '@/hooks/useInit'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { RootState } from '@/store'
import { PathName } from '@/routes'
import styles from './index.module.scss'
import { useSelector } from 'react-redux'

// Components
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import PageLoading from '@/components/PageLoading'

const { Header, Footer: SemiFooter, Content } = Layout

const SignLayout = React.memo(() => {
  const navigate = useNavigate()
  const location = useLocation()

  const { getBlogConfigService } = useInit()
  const { isLogin } = useSelector((state: RootState) => state.common)

  useEffect(() => {
    // 已登录
    if (isLogin) {
      navigate(PathName.HOME, {
        replace: true,
      })
    }
  }, [isLogin])

  useEffect(() => {
    // 直接跳转子路由LOGIN
    if (location.pathname === PathName.SIGN) {
      navigate(PathName.LOGIN, {
        replace: true,
      })
    }
  }, [])

  return (
    <Layout className='layout'>
      <Header>
        <Nav />
      </Header>

      <Content style={{ position: 'relative' }}>
        {getBlogConfigService.loading ? (
          <PageLoading />
        ) : (
          <section className={styles.signContainer}>
            <aside className={styles.banner}>banner TODO</aside>
            <section className={styles.form}>
              <Outlet />
            </section>
          </section>
        )}
      </Content>
      <SemiFooter>
        <Footer />
      </SemiFooter>
    </Layout>
  )
})

export default SignLayout
