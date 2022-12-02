import { formatDistanceToNow as _formatDistanceToNow, isValid } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { isNil } from 'lodash-es'
import lottie, { AnimationConfigWithData, AnimationConfigWithPath } from 'lottie-web'
import qs from 'qs'

export const isDef = <T>(v: T | undefined | null): v is T => v !== undefined && v !== null

export const isUndef = (v: any): v is undefined | null => v === undefined || v === null

export const scrollIntoTop = (
  el: HTMLElement | null = document.querySelector('#right-content'),
) => {
  if (!el) {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  } else {
    el.scrollTop = 0
  }
}

export const $ = (selector: string): HTMLElement | null => document.querySelector(selector)

export const $$ = (selector: string) => document.querySelectorAll(selector)

export const removePX = (str: string) => Number(str.slice(0, str.length - 2))

export const computeDOMHeight = (selector: string, noPX?: boolean) => {
  const dom = $(selector)
  if (!dom) return '0px'
  const height = getComputedStyle(dom).height
  return noPX ? removePX(height) : height
}

export const setUpYunImg = (fileUrl?: string, type?: 'sm' | 'md' | 'origin'): string | undefined =>
  fileUrl && type && /^https?:\/\/upyun\.hokori\.online/.test(fileUrl)
    ? `${fileUrl}!${type}`
    : fileUrl

export const formatDistanceToNow = (date: string | Date | undefined) => {
  if (!date || !isValid(date)) return '-'
  return _formatDistanceToNow(date instanceof Date ? date : new Date(date), {
    locale: zhCN,
    addSuffix: true,
  })
}

export type AnimationConfig = AnimationConfigWithPath | AnimationConfigWithData
export const loadAnimation = (
  dom: Element,
  animationData: any,
  options: AnimationConfig = {} as any,
) => {
  const lottieIns = lottie.loadAnimation({
    renderer: 'svg',
    autoplay: true,
    loop: true,
    rendererSettings: {
      progressiveLoad: true,
    },
    ...options,
    container: dom,
    animationData,
  })
  return lottieIns
}

export type GetUrlParamsFn = <T extends Record<string | number | symbol, any> = any>(
  searchStr?: string,
) => T

export const getUrlParams: GetUrlParamsFn = <T>(searchStr?: string) => {
  let _searchStr = searchStr || window.location.search
  if (_searchStr.startsWith('?')) {
    _searchStr = _searchStr.slice(1)
  }
  if (_searchStr) {
    return qs.parse(_searchStr) as unknown as T
  }
  return {} as unknown as T
}

interface JSONOptions {
  noError?: boolean
}

export const JSONParse = <T = unknown>(
  json?: string | null,
  { noError = true }: JSONOptions = {},
): T | undefined | null => {
  if (isNil(json)) {
    return json
  }
  try {
    return JSON.parse(json)
  } catch (e) {
    if (!noError) {
      throw e
    }
  }
}

export const JSONStringify = (
  obj: unknown,
  { noError = true }: JSONOptions = {},
): string | undefined | null => {
  if (isNil(obj)) {
    return obj
  }
  try {
    return JSON.stringify(obj)
  } catch (e) {
    if (!noError) {
      throw e
    }
  }
}

export interface LsGetOption<T> extends JSONOptions {
  defaultValue?: T
  raw?: boolean
}
export interface LsSetOption {
  raw?: boolean
}

export const ls = {
  get: <T>(key?: string, { defaultValue, raw }: LsGetOption<T> = {}): T | undefined => {
    if (isNil(key)) {
      return defaultValue || key
    }
    const res = localStorage.getItem(key)
    if (isNil(res)) {
      return defaultValue
    }
    if (raw) {
      return (res || defaultValue) as T
    }
    return JSONParse<T>(res) || defaultValue
  },
  set: (key: string, value?: unknown, { raw }: LsSetOption = {}) => {
    if (isNil(value)) {
      return localStorage.removeItem(key)
    }
    const _value = raw ? String(value) : JSONStringify(value)
    if (isNil(_value)) {
      return localStorage.removeItem(key)
    }
    localStorage.setItem(key, _value)
  },
}
