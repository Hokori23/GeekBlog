import axios, { AxiosRequestConfig } from 'axios'
import { Notification } from '@douyinfe/semi-ui'
import { store } from '@/store'
import { REQUEST_WHITE_LIST } from '../const'
import { Restful } from './type'
import * as User from './User'
import * as Mail from './Mail'
import * as Upload from './Upload'
import * as Init from './Init'
import * as Option from './Option'
import * as Post from './Post'
import * as PostComment from './PostComment'
import * as PostTag from './PostTag'

const isWhiteUrl = (url: string) => {
  return !REQUEST_WHITE_LIST.every((reg) => !reg.test(url))
}

export interface EnhanceAxiosRequestConfig extends AxiosRequestConfig {
  silent?: boolean
  noCancel?: boolean
}

export const Request = async <T>(config: EnhanceAxiosRequestConfig) => {
  const { dispatch } = store
  const isWhiteUrlFlag = isWhiteUrl(config.url as string)
  try {
    const token = store.getState().common.token
    const headers = config.headers || {}
    // 如果本地有token，每个非白名单请求都附带上token
    if (token && !isWhiteUrlFlag) {
      headers.Authorization = `Bearer ${token}`
    }
    const res = await axios.request<Restful<T>>({
      ...config,
      headers,
    })
    if (res.status !== 200) {
      Notification.error({
        title: '错误',
        content: `请求失败，状态码：${String(res.status)}`,
        duration: 3,
      })
    } else if (config.silent) {
      // 如果不这么强转的话，请求类型会发散，导致业务代码都需要缩小类型
      return res as unknown as T
    } else if (
      (isWhiteUrlFlag && res.data.code !== 200) ||
      (!isWhiteUrlFlag && res.data.code !== 0) // TODO: code非零都弹提示框？
    ) {
      Notification.warning({
        title: '警告',
        content: res.data.message || '请求错误',
        duration: 3,
      })
    }
    return res.data as unknown as T
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.log(err.response)
    // eslint-disable-next-line no-console
    console.error('网络错误', err)
    if (err?.response?.status === 401 && !isWhiteUrlFlag) {
      Notification.info({
        title: '提示',
        content: '登陆失效，请重新登陆',
        duration: 3,
      })
      dispatch.common.logOut()
    } else if (err?.response?.status === 403) {
      Notification.error({
        title: '警告',
        content: '无权进行此操作',
        duration: 3,
      })
    } else {
      Notification.error({
        title: '警告',
        content: err?.response?.data || String(err),
        duration: 3,
      })
    }
  }
}
export { User, Mail, Post, PostComment, PostTag, Upload, Init, Option }
export default { User, Mail, Post, PostComment, PostTag, Upload, Init, Option }
