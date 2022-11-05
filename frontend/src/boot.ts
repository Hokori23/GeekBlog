import { store } from '@/store'
import { ACCESS_TOKEN_NAME, BLOG_CONFIG, USER_INFO_NAME } from '@/utils/const'
import { Option } from './utils/Request/Option'
// 初始化store
const { dispatch } = store

const token = localStorage.getItem(ACCESS_TOKEN_NAME)
const userInfo = localStorage.getItem(USER_INFO_NAME)
const blogConfig = localStorage.getItem(BLOG_CONFIG)
if (!token || !userInfo) {
  localStorage.removeItem(ACCESS_TOKEN_NAME)
  localStorage.removeItem(USER_INFO_NAME)
} else {
  dispatch.common.setUserInfo(JSON.parse(userInfo || 'null'))
  dispatch.common.setToken(token)
  dispatch.common.login()
}
dispatch.common.setBlogConfig(JSON.parse(blogConfig || 'null'))
