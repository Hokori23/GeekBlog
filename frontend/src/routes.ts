import { lazy, FunctionComponent, ComponentClass, LazyExoticComponent } from 'react'
import BlankLayout from '@/layouts/BlankLayout'
import SignLayout from '@/layouts/SignLayout'
import { LayoutProps } from '@/layouts/types'
import Demo from '@/containers/Demo'
import PostOverview from '@/containers/Home/PostOverview'
import MomentOverview from '@/containers/Home/MomentOverview'
import PostTag from '@/containers/Home/PostTag'
import PostTagOverview from '@/containers/Home/PostTagOverview'
import User from '@/containers/Home/User'
import UserDetail from '@/containers/Home/UserDetail'
import NotFoundPage from '@/containers/NotFoundPage'
import Redirect404 from '@/containers/Redirect404'
import Admin from '@/containers/Admin'
import PostTagAdmin from '@/containers/Admin/PostTagAdmin'
import PostAdmin from '@/containers/Admin/PostAdmin'
import MomentAdmin from '@/containers/Admin/MomentAdmin'
import UserAdmin from '@/containers/Admin/UserAdmin'
import PostDetailAdmin from '@/containers/Admin/PostDetailAdmin'
import MomentDetailAdmin from '@/containers/Admin/MomentDetailAdmin'
import UserDetailAdmin from '@/containers/Admin/UserDetailAdmin'
import System from '@/containers/Admin/System'
import HomeDetail from '@/containers/Home/PostDetail'
import MainLayout from './layouts/MainLayout'
import Spin from './components/Spin'

export enum PathName {
  DEMO = '/demo',
  INIT = '/init',
  SIGN = '/sign',
  LOGIN = '/sign/login',
  REGISTER = '/sign/register',
  _HOME = '/',
  HOME = '/home',
  HOME_DETAIL = '/home/detail',
  POST_OVERVIEW = '/post',
  POST_DETAIL = '/post/detail',
  MOMENT_OVERVIEW = '/moment',
  _MOMENT_DETAIL = '/moment/detail',
  POST_TAG = '/tags',
  _POST_TAG_OVERVIEW = '/tag',
  POST_TAG_OVERVIEW = '/tag/:slug',
  USER = '/user',
  _USER_DETAIL = '/user/detail',
  USER_DETAIL = '/user/detail',
  ADMIN = '/admin',
  POST_TAG_ADMIN = '/admin/post-tag',
  POST_ADMIN = '/admin/post',
  MOMENT_ADMIN = '/admin/moment',
  USER_ADMIN = '/admin/user',
  _USER_DETAIL_ADMIN = '/admin/user/detail',
  USER_DETAIL_ADMIN = '/admin/user/detail',
  _POST_DETAIL_ADMIN = '/admin/post/detail',
  POST_DETAIL_ADMIN = '/admin/post/detail',
  _MOMENT_DETAIL_ADMIN = '/admin/moment/detail',
  MOMENT_DETAIL_ADMIN = '/admin/moment/detail',
  SYSTEM = '/admin/system',
  _NOT_FOUND_PAGE = '*',
  NOT_FOUND_PAGE = '/404',
}

export enum RouteName {
  DEMO = 'DEMO',
  INIT = '初始化博客',
  LOGIN = '登录',
  REGISTER = '注册',
  HOME = '首页',
  POST = '文章',
  MOMENT = '说说',
  POST_TAG = '标签',
  USER = '用户中心',
  NOT_FOUND_PAGE = '找不到页面',
  ADMIN = '后台管理中心',
  POST_TAG_ADMIN = '标签',
  POST_ADMIN = '文章',
  POST_DETAIL_ADMIN = '文章',
  MOMENT_ADMIN = '说说',
  MOMENT_DETAIL_ADMIN = '说说',
  USER_ADMIN = '用户',
  USER_DETAIL_ADMIN = '用户',
  SYSTEM = '博客设置',
}

/* 集中存放所有路由配置 */
export const routes: RouteConfig[] = [
  // {
  //   path: PathName.DEMO,
  //   element: Demo,
  //   routeProps: {
  //     exact: true,
  //   },
  // },
  {
    path: PathName.INIT,
    menuKey: PathName.INIT,
    element: BlankLayout,
    children: [
      {
        path: PathName.INIT,
        menuKey: PathName.INIT,
        isLazy: true,
        element: lazy(() => import('@/containers/Init')),
      },
    ],
  },
  {
    path: PathName.SIGN,
    menuKey: PathName.SIGN,
    element: SignLayout,
    childFallback: Spin,
    children: [
      {
        path: PathName.LOGIN,
        isLazy: true,
        menuKey: PathName.LOGIN,
        element: lazy(() => import('@/containers/Sign/Login')),
      },
      {
        path: PathName.REGISTER,
        isLazy: true,
        menuKey: PathName.REGISTER,
        element: lazy(() => import('@/containers/Sign/Register')),
      },
      {
        path: PathName._NOT_FOUND_PAGE,
        isLazy: true,
        menuKey: PathName.NOT_FOUND_PAGE,
        element: lazy(() => import('@/containers/NotFoundPage')),
      },
    ],
  },
  // {
  //   path: PathName.ADMIN,
  //   element: Admin,
  //   routeProps: {
  //     exact: true,
  //   },
  // },
  // {
  //   path: PathName.ADMIN,
  //   element: Admin,
  //   routes: [
  //     {
  //       path: PathName.POST_TAG_ADMIN,
  //       element: PostTagAdmin,
  //       routeProps: {
  //         exact: true,
  //       },
  //     },
  //     {
  //       path: PathName.MOMENT_DETAIL_ADMIN,
  //       element: MomentDetailAdmin,
  //     },
  //     {
  //       path: PathName._MOMENT_DETAIL_ADMIN,
  //       element: MomentDetailAdmin,
  //     },
  //     {
  //       path: PathName.POST_DETAIL_ADMIN,
  //       element: PostDetailAdmin,
  //     },
  //     {
  //       path: PathName._POST_DETAIL_ADMIN,
  //       element: PostDetailAdmin,
  //     },
  //     {
  //       path: PathName.USER_DETAIL_ADMIN,
  //       element: UserDetailAdmin,
  //     },
  //     {
  //       path: PathName.POST_ADMIN,
  //       element: PostAdmin,
  //     },
  //     {
  //       path: PathName.MOMENT_ADMIN,
  //       element: MomentAdmin,
  //     },
  //     {
  //       path: PathName.USER_ADMIN,
  //       element: UserAdmin,
  //     },
  //     {
  //       path: PathName.SYSTEM,
  //       element: System,
  //     },
  //     {
  //       path: PathName._NOT_FOUND_PAGE,
  //       element: NotFoundPage,
  //     },
  //   ],
  // },
  {
    path: PathName._HOME,
    menuKey: PathName.HOME,
    element: MainLayout,
    children: [
      {
        path: PathName.HOME,
        menuKey: PathName.HOME,
        isLazy: true,
        element: lazy(() => import('@/containers/Home/HomeOverview')),
      },
      {
        path: PathName.HOME_DETAIL,
        menuKey: PathName.HOME,
        isLazy: true,
        element: lazy(() => import('@/containers/Home/PostDetail')),
        // element: HomeDetail,
      },
      {
        path: PathName.POST_OVERVIEW,
        menuKey: PathName.POST_OVERVIEW,
        isLazy: true,
        element: lazy(() => import('@/containers/Home/PostOverview')),
      },
      {
        path: PathName.POST_DETAIL,
        menuKey: PathName.POST_OVERVIEW,
        isLazy: true,
        element: lazy(() => import('@/containers/Home/PostDetail')),
      },
      // {
      //   path: PathName.MOMENT_OVERVIEW,
      //   element: MomentOverview,
      // },
      // {
      //   path: PathName.POST_TAG_OVERVIEW,
      //   element: PostTagOverview,
      // },
      // {
      //   path: PathName.POST_TAG,
      //   element: PostTag,
      // },
      // {
      //   path: PathName.USER_DETAIL,
      //   element: UserDetail,
      // },
      // {
      //   path: PathName.USER,
      //   element: User,
      // },
      {
        path: PathName._NOT_FOUND_PAGE,
        menuKey: PathName.NOT_FOUND_PAGE,
        isLazy: true,
        element: lazy(() => import('@/containers/NotFoundPage')),
      },
    ],
  },
  {
    path: PathName._NOT_FOUND_PAGE,
    menuKey: PathName.NOT_FOUND_PAGE,
    isLazy: true,
    element: lazy(() => import('@/containers/NotFoundPage')),
  },
  // {
  //   path: PathName.NOT_FOUND_PAGE,
  //   menuKey: PathName.NOT_FOUND_PAGE,
  //   isLazy: true,
  //   element: lazy(() => import('@/containers/NotFoundPage')),
  // },
]

const genRoutesMap = (routes: RouteConfig[]) => {
  const routesMap: Record<
    string,
    {
      path: string
      menuKey: string
    }
  > = {}
  const recur = (routes: RouteConfig[]) => {
    routes.forEach(({ path, menuKey, children }) => {
      routesMap[path] = {
        path,
        menuKey,
      }
      children && recur(children)
    })
  }
  recur(routes)
  return routesMap
}

export const routesMap = genRoutesMap(routes)

export interface RouteConfig {
  /* 路由路径 */
  path: string
  /* 侧边栏Item激活Key */
  menuKey: string
  /* 需要渲染的组件 */
  isLazy?: boolean
  element: ComponentClass<any> | FunctionComponent<any> | LazyExoticComponent<any>
  childFallback?: ComponentClass<any> | FunctionComponent<any>
  layout?: ComponentClass<LayoutProps> | FunctionComponent<LayoutProps>
  /* 子路由 */
  children?: RouteConfig[]
}
