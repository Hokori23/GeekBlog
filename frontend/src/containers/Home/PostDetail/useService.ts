import { Notification } from '@douyinfe/semi-ui'
import { useRequest } from 'ahooks'
import { Request } from '@/utils'
import { CodeDictionary } from '@/utils/Request/type'
import { useSelector } from 'react-redux'
import { RootState, store } from '@/store'

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

  const getPostService = useRequest(async () => {
    const res = await Request.Post.Retrieve(Number(id))
    if (res?.code === CodeDictionary.SUCCESS && res?.data) {
      dispatch.setPost(res.data)
    }
  })
  const editPostService = useRequest(
    async (content = '') => {
      const tags = post?.tags.map((v) => v.id) || []
      const newPost = {
        ...post!,
        content,
        tags,
      }
      const res = await Request.Post.EditByAdmin({
        post: newPost,
        tids: tags,
      })
      if (res?.code === CodeDictionary.SUCCESS && res?.data) {
        Notification.success({
          content: res.message,
        })
        dispatch.setPost(res.data)
        onSave()
      }
    },
    {
      manual: true,
    },
  )
  const deletePostService = useRequest(
    async () => {
      const res = await Request.Post.DeleteByAdmin(post!.id!)
      if (res?.code === CodeDictionary.SUCCESS) {
        Notification.success({
          content: res.message,
        })
        onDelete()
      }
    },
    {
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
