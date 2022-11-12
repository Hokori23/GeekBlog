import { FC } from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import { routes } from './routes'
import { history } from '@/store'
import { ConnectedRouter } from 'connected-react-router'
import NotFoundPage from '@/containers/NotFoundPage'
import MainLayout from '@/layouts/MainLayout'
import { AliveScope } from 'react-activation'
import './App.scss'

const Routes: FC = () => {
  return (
    <Switch>
      {routes.map(
        ({
          path,
          routeProps,
          routes,
          component: Component,
          layout: Layout = MainLayout as any,
        }) => (
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
  return (
    <div className='App'>
      <BrowserRouter>
        <ConnectedRouter history={history}>
          {/**
           * 404页面兜底
           * <https://blog.csdn.net/grepets/article/details/96393575>}
           */}
          <AliveScope>
            <Route
              render={({ location }) =>
                (location as any)?.state?.is404 ? <NotFoundPage /> : <Routes />
              }
            />
          </AliveScope>
        </ConnectedRouter>
      </BrowserRouter>
    </div>
  )
}
export default App
