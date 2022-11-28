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
    if (res?.code === CodeDictionary.SUCCESS) {
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
      const res = await Request.Post.Edit__Admin({
        post: newPost,
        tids: tags,
      })
      if (res?.code === CodeDictionary.SUCCESS) {
        Notification.success({
          content: '保存成功',
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
      const res = await Request.Post.Delete__Admin(post!.id!)
      if (res?.code === CodeDictionary.SUCCESS) {
        Notification.success({
          content: '删除成功',
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
