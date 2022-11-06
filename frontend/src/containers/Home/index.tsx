import { RouteConfig } from '@/routes'
import React from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router-dom'

const Home = React.memo<RouteComponentProps & RouteConfig>((props) => {
  const { routes, location } = props
  return (
    <Switch location={location}>
      {routes?.map(({ path, routeProps, routes, component: Component }) => (
        <Route
          {...routeProps}
          key={path}
          path={path}
          render={(props: any) => <Component {...props} routes={routes} />}
        />
      ))}
    </Switch>
  )
})
export default Home
