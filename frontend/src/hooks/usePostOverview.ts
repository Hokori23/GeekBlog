import { Request } from '@/utils'
import { PostType, Toggle } from '@/utils/Request/Post'
import { useMemo } from 'react'
import { isDef, scrollIntoTop } from '@/utils/tools'
import { PathName } from '@/routes'
import { useHistory, useLocation } from 'react-router-dom'
import { useRequest } from 'ahooks'
import useUrlParams from '@/hooks/useUrlParams'
import { PaginationProps } from '@douyinfe/semi-ui/lib/es/pagination'

interface PostOverviewForm {
  page: number
  capacity: number
  isASC: Toggle
  postTypes: PostType[]
}

export const usePostOverview = ({ postTypes }: { postTypes: PostType[] }) => {
  const location = useLocation()
  const history = useHistory()
  const defaultFormValues = useMemo(
    () => ({
      page: 1,
      capacity: 5,
      isASC: Toggle.N,
      postTypes,
    }),
    [],
  )
  const { urlParams, setUrlParams } = useUrlParams<PostOverviewForm>({
    initUrlParams: location.search ? undefined : defaultFormValues,
  })
  const { data, loading } = useRequest(
    async () => {
      const res = await Request.Post.RetrieveAll(urlParams)
      const { capacity, page } = urlParams
      if (res?.data) {
        const data = res.data
        const maxPage = Math.ceil(data.total / capacity)
        scrollIntoTop()
        if (data.total && isDef(maxPage) && page > maxPage) {
          // 无效路由参数
          history.replace(PathName.NOT_FOUND_PAGE)
        }
        return {
          posts: data.posts || [],
          total: data.total,
          maxPage,
        }
      }
    },
    {
      refreshDeps: [urlParams],
    },
  )

  const pagination: PaginationProps = useMemo(
    () => ({
      total: data?.total,
      pageSize: Number(urlParams.capacity),
      currentPage: Number(urlParams.page),
      onPageChange: (newPage) =>
        setUrlParams({
          ...urlParams,
          page: newPage,
        }),
      pageSizeOpts: [5, 10, 20],
    }),
    [data, urlParams],
  )

  return {
    params: urlParams,
    loading,
    data,
    posts: data?.posts,
    pagination,
  }
}
