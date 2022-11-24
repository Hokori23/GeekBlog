import { createModel } from '@rematch/core'
import { RootModel } from './models'
import { LS_KEYS } from './utils/const'
import Request from './utils/Request'
import { Option } from './utils/Request/Option'
import { CodeDictionary } from './utils/Request/type'
import { User } from './utils/Request/User'
import { computeDOMHeight, ls } from './utils/tools'

export interface CommonState {
  userInfo?: Partial<User>
  token?: string
  isLogin: boolean
  blogConfig: Option[] | null
  mainHeight: string
}

export const defaultCommonState: CommonState = {
  userInfo: ls.get<Partial<User>>(LS_KEYS.USER_INFO_NAME, {
    defaultValue: {},
  }),
  token: ls.get<string>(LS_KEYS.ACCESS_TOKEN_NAME, { raw: true }),
  isLogin: false,
  blogConfig: ls.get<Option[] | null>(LS_KEYS.BLOG_CONFIG, {
    defaultValue: null,
  })!,
  mainHeight: '0px',
}

export const common = createModel<RootModel>()({
  state: defaultCommonState,
  reducers: {
    setUserInfo: (state: CommonState, newUserInfo: Partial<User>) => {
      state.userInfo = newUserInfo
      localStorage.setItem(LS_KEYS.USER_INFO_NAME, JSON.stringify(newUserInfo))
      return state
    },
    setToken: (state: CommonState, newToken?: string) => {
      state.token = newToken
      newToken && localStorage.setItem(LS_KEYS.ACCESS_TOKEN_NAME, newToken)
      return state
    },
    login: (state: CommonState) => {
      state.isLogin = true
      return state
    },
    logOut: (state: CommonState) => {
      state.userInfo = defaultCommonState.userInfo
      state.isLogin = false
      state.token = ''
      localStorage.removeItem(LS_KEYS.USER_INFO_NAME)
      localStorage.removeItem(LS_KEYS.ACCESS_TOKEN_NAME)
      return state
    },
    setBlogConfig: (state: CommonState, newBlogConfig: Option[]) => {
      state.blogConfig = newBlogConfig
      localStorage.setItem(LS_KEYS.BLOG_CONFIG, JSON.stringify(newBlogConfig))
      return state
    },
    setMainHeight: (state: CommonState, newHeight?: string) => {
      let height = newHeight
      if (!height) {
        height = `${window.innerHeight - (computeDOMHeight('#App-Bar', true) as number)}px`
      }
      state.mainHeight = height
      return state
    },
  },
  effects: (dispatch) => {
    const { common } = dispatch
    return {
      async checkLogin(_, state) {
        if (state.common.isLogin) {
          // 当本地为已登录状态时，向后端确认此状态是否合法
          const res = await Request.User.Check()
          if (res?.data?.code !== CodeDictionary.SUCCESS) {
            common.logOut()
          }
        }
      },
      async getBlogConfig() {
        const res = await Request.Option.RetrieveAll()
        if (res?.data) {
          common.setBlogConfig(res.data)
        }
      },
    }
  },
})
