import { ComponentClass, FC, FunctionComponent, Suspense } from 'react'
import { BrowserRouter, useRoutes, RouteObject } from 'react-router-dom'
import { RouteConfig, routes } from './routes'
import { AliveScope } from 'react-activation'
import './App.scss'
import PageLoading from './components/PageLoading'

const syncRouter = (
  routes?: RouteConfig[],
  Fallback?: ComponentClass<any> | FunctionComponent<any>,
): RouteObject[] => {
  if (!routes?.length) {
    return []
  }
  return routes.map((route) => ({
    ...route,
    element: route.isLazy ? (
      <Suspense fallback={Fallback ? <Fallback /> : <PageLoading />}>
        <route.element />
      </Suspense>
    ) : (
      <route.element />
    ),
    children: route.children?.length ? syncRouter(route.children, route.childFallback) : [],
  }))
}

const Router = () => useRoutes(syncRouter(routes))

const App: FC = () => {
  return (
    <div className='App'>
      <BrowserRouter>
        <AliveScope>
          <Router />
        </AliveScope>
      </BrowserRouter>
    </div>
  )
}
export default App
