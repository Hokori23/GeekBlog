// import _markdownIt from 'markdown-it'
// import hljs from 'highlight.js'
import { formatDistanceToNow as _formatDistanceToNow, isValid } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import lottie, { AnimationConfigWithData, AnimationConfigWithPath } from 'lottie-web'

export const isDef = <T>(v: T | undefined | null): v is T => v !== undefined && v !== null

export const isUndef = (v: any): v is undefined | null => v === undefined || v === null

export const isEmail = (v: string): boolean =>
  /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/.test(v)

export const scrollTo = (
  id: string,
  block: 'center' | 'end' | 'nearest' | 'start' | undefined = 'center',
  behavior: 'smooth' | 'auto' | undefined = 'smooth',
) => {
  const anchor = document.querySelector(id)
  if (anchor) {
    anchor.scrollIntoView({ behavior, block })
  }
}

export const scrollIntoTop = (
  block: 'center' | 'end' | 'nearest' | 'start' | undefined = 'center',
  behavior: 'smooth' | 'auto' | undefined = 'smooth',
) => {
  scrollTo('#back-to-top-anchor', block, behavior)
}

export const scrollIntoBottom = (
  block: 'center' | 'end' | 'nearest' | 'start' | undefined = 'center',
  behavior: 'smooth' | 'auto' | undefined = 'smooth',
) => {
  scrollTo('#go-to-bottom-anchor', block, behavior)
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

export const setUpYunImg = (fileUrl: string, type: 'sm' | 'md' | 'origin'): string =>
  /^https?:\/\/upyun\.hokori\.online/.test(fileUrl) ? `${fileUrl}!${type}` : fileUrl

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
