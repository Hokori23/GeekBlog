import qs from 'qs'
import { useCallback, useMemo, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { isNil } from 'lodash-es'
import { getUrlParams } from '@/utils/tools'

export interface UrlParamsOptions<T> {
  autoMergeUrlParams?: boolean
  initUrlParams?: T
  format?: <P = T>(values: T) => P
  convert?: (params: any) => any
  replace?: boolean
}

export interface UrlParamsInstance<T extends Record<string | number | symbol, any> = any> {
  initUrlParams: T
  urlParams: T
  getUrlParams: GetUrlParamsFn
  setUrlParams: (params: T, state?: any, hash?: string) => void
}

export type GetUrlParamsFn = <T extends Record<string | number | symbol, any> = any>(
  searchStr?: string,
) => T

const useUrlParams = <T extends Record<string | number | symbol, any> = any>(
  { autoMergeUrlParams, initUrlParams, format, convert, replace }: UrlParamsOptions<T> = {
    autoMergeUrlParams: true,
    replace: true,
  },
) => {
  // 获取router的状态
  const location = useLocation()
  const urlParams = useMemo<T>(() => {
    const p = initUrlParams ? initUrlParams : getUrlParams<T>(location.search)
    if (convert) {
      return convert(p) || {}
    }
    return p
  }, [location.search, convert])

  // 记忆初始参数
  const initUrlParamsRef = useRef(urlParams)

  // 更新url参数
  const navigate = useNavigate()
  const setUrlParams: UrlParamsInstance<T>['setUrlParams'] = useCallback(
    (params, state, hash) => {
      const _params = format ? format(params) || {} : params
      let newParams = autoMergeUrlParams
        ? {
            ...getUrlParams<T>(),
            ..._params,
          }
        : { ..._params }
      const newSearch = `?${qs.stringify(newParams)}${isNil(hash) ? window.location.hash : hash}`
      navigate(newSearch, {
        replace,
        state,
      })
    },
    [format, autoMergeUrlParams, history, replace],
  )

  const _getUrlParams = useCallback(() => getUrlParams<T>(), [])

  return {
    initUrlParams: initUrlParamsRef.current,
    urlParams,
    getUrlParams: _getUrlParams,
    setUrlParams,
  }
}
export default useUrlParams
