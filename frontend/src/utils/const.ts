export enum LS_KEYS {
  ACCESS_TOKEN_NAME = 'ACCESS_TOKEN',
  USER_INFO_NAME = 'USER_INFO',
  BLOG_CONFIG = 'BLOG_CONFIG',
}

export const UPYUN_URL = 'https://upyun.hokori.online'
export const REQUEST_WHITE_LIST: RegExp[] = [/^https:\/\/v0.api.upyun.com/]
export const isDev = import.meta.env.DEV
export const SECOND = 1000
export const MINUTE = 60 * SECOND
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR
