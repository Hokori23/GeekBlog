import { FC, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Route, RouteComponentProps, Switch } from 'react-router-dom'
import { PathName, RouteConfig } from '@/routes'
import { RootState } from '@/store'
import KeepAlive from 'react-activation'
const Sign: FC<RouteComponentProps & RouteConfig> = ({ routes, history, location }) => {
  const { isLogin } = useSelector((state: RootState) => state.common)

  useEffect(() => {
    // 已登录
    if (isLogin) {
      history.replace(PathName.HOME)
    }
  }, [isLogin])

  useEffect(() => {
    // 直接跳转子路由LOGIN
    if (location.pathname === PathName.SIGN) {
      history.replace(PathName.LOGIN)
    }
  }, [])

  return routes?.length ? (
    <Switch location={location}>
      {routes!.map(({ path, routeProps, routes, component: Component }) => (
        <Route
          key={path}
          {...routeProps}
          path={path}
          render={(props: any) => (
            <KeepAlive id={path} name={path}>
              <Component {...props} routes={routes} />
            </KeepAlive>
          )}
        />
      ))}
    </Switch>
  ) : null
}
export default Sign
