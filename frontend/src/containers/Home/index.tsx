import { PathName, RouteConfig } from '@/routes'
import React, { FC, Fragment, useEffect } from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router-dom'
import { isDef } from '@/utils/tools'
import classnames from 'classnames'
import { useDeskTopSize } from '@/hooks/useScreenSize'

// components
import { AppBar } from '@/components/AppBar'
import { Drawer } from '@/components/Drawer'
import UserStatus from '@/components/UserStatus'
import Footer from '@/components/Footer'
// import { Navigation } from '@/containers/Home/Navigation'

const Home: FC<RouteComponentProps & RouteConfig> = (props) => {
  const { routes, location, history } = props
  const isDeskTopSize = useDeskTopSize()

  // useEffect(() => {
  //   if (location.pathname === PathName._HOME) {
  //     history.replace(PathName.HOME)
  //   }
  // }, [])

  // const onCurTabIdxChange = (event: React.ChangeEvent<{}>, newVal: number) => {
  //   setCurTabIdx(newVal)
  //   history.push(tabs[newVal].path) // TODO: Tab页面跳转应该清空路由栈
  // }

  return 'Home'
}
export default Home
