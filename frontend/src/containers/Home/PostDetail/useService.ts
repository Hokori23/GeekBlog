import { Notification } from '@douyinfe/semi-ui'
import { useRequest } from 'ahooks'
import { Request } from '@/utils'
import { CodeDictionary } from '@/utils/Request/type'
import { useSelector } from 'react-redux'
import { RootState, store } from '@/store'
import { PostRequest } from '@/utils/Request/Post'
import { isNil } from 'lodash-es'

export default ({
  id,
  onSave,
  onDelete,
}: {
  id: number
  onSave: () => void
  onDelete: () => void
}) => {
  const { post } = useSelector((state: RootState) => state.postDetail)
  const dispatch = useSelector(() => store.dispatch.postDetail)

  const getPostService = useRequest(
    async () => {
      const res = await Request.Post.Retrieve(id)
      if (res?.code === CodeDictionary.SUCCESS && res?.data) {
        dispatch.setPost(res.data)
      }
    },
    {
      ready: !Number.isNaN(id),
    },
  )
  const editPostService = useRequest(
    async (payload: PostRequest) => {
      const res = await Request.Post.EditByAdmin(payload)
      if (res?.code === CodeDictionary.SUCCESS && res?.data) {
        Notification.success({
          content: res.message,
        })
        dispatch.setPost(res.data)
        onSave()
      }
    },
    {
      ready: !Number.isNaN(id),
      manual: true,
    },
  )
  const deletePostService = useRequest(
    async () => {
      const res = await Request.Post.DeleteByAdmin(id)
      if (res?.code === CodeDictionary.SUCCESS) {
        Notification.success({
          content: res.message,
        })
        onDelete()
      }
    },
    {
      ready: !Number.isNaN(id),
      manual: true,
    },
  )

  return {
    getPostService,
    editPostService,
    deletePostService,
    post,
  }
}
