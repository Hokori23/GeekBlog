import React, { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import { routes } from './routes'
import { RootState, history, store } from '@/store'
import { ConnectedRouter } from 'connected-react-router'
import { RequestSnackBar } from '@/components/RequestSnackBar'
import NotFoundPage from '@/containers/NotFoundPage'
import MainLayout from '@/layouts/MainLayout'
import { AliveScope } from 'react-activation'
import './boot'

const root = document.querySelector('#root')

const Routes: FC = () => {
  return (
    <Switch>
      {routes.map(
        ({ path, routeProps, routes, component: Component, layout: Layout = MainLayout }) => (
          <Route
            key={path}
            {...routeProps}
            path={path}
            render={(props: any) => <Layout Component={Component} {...props} routes={routes} />}
          />
        ),
      )}
    </Switch>
  )
}

const App: FC = () => {
  const state = useSelector((state: RootState) => state.common)
  const dispatch = useSelector(() => store.dispatch.common)
  const [appStyle, setAppStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    // 初始化页面高度
    const listener = () => {
      setAppStyle({
        minHeight: window.innerHeight,
      })
      dispatch.setMainHeight()
    }
    listener()
    document.addEventListener('resize', listener)
    return () => {
      document.removeEventListener('resize', listener)
    }
  }, [])
  return (
    <div className='App' style={appStyle}>
      <BrowserRouter>
        <ConnectedRouter history={history}>
          {/**
           * 404页面兜底
           * <https://blog.csdn.net/grepets/article/details/96393575>}
           */}
          <AliveScope>
            {/* <Route
            render={({ location }) =>
              (location as any)?.state?.is404 ? <NotFoundPage /> : <Routes />
            }
          /> */}
            <Route render={({ location }) => <Routes />} />
          </AliveScope>
        </ConnectedRouter>
      </BrowserRouter>
    </div>
  )
}
export default App
