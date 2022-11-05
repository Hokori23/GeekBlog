import { useRequest } from 'ahooks'
import { useSelector } from 'react-redux'
import { RootState, store } from '@/store'
const useInitBlogConfig = () => {
  const { blogConfig } = useSelector((state: RootState) => state.common)
  const dispatch = useSelector(() => store.dispatch.common)

  const getBlogConfigService = useRequest(
    async () => {
      await dispatch.getBlogConfig(null)
    },
    {
      manual: Boolean(blogConfig),
    },
  )

  return {
    blogConfig: blogConfig,
    ...getBlogConfigService,
  }
}

export default useInitBlogConfig
