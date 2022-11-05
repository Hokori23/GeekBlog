import { configResponsive, useResponsive } from 'ahooks'

configResponsive({
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
})

export const useMobileSize = () => !useResponsive().md
export const useDeskTopSize = () => useResponsive().md
