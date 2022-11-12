import { useRequest } from 'ahooks'
import { useSelector } from 'react-redux'
import { RootState, store } from '@/store'
import { useEffect } from 'react'

const useInit = () => {
  const { blogConfig, token, userInfo } = useSelector((state: RootState) => state.common)
  const dispatch = useSelector(() => store.dispatch.common)

  const getBlogConfigService = useRequest(dispatch.getBlogConfig, {
    manual: Boolean(blogConfig),
  })
  useEffect(() => {
    if (token && userInfo) {
      dispatch.login()
    }
  }, [])

  return {
    blogConfig,
    getBlogConfigService,
  }
}

export default useInit
