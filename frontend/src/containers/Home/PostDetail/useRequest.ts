import { Notification } from '@douyinfe/semi-ui'
import { useRequest } from 'ahooks'
import { Request } from '@/utils'
import { PostWithAuthor } from '@/utils/Request/Post'

export default ({ id, onSave }: { id: number; onSave: () => void }) => {
  const getPostService = useRequest(() => Request.Post.Retrieve(Number(id)))
  const post = getPostService.data?.data
  const savePostService = useRequest(
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
      if (res?.code === 0) {
        Notification.success({
          content: '保存成功',
        })
        onSave()
      }
    },
    {
      manual: true,
    },
  )

  return {
    getPostService,
    savePostService,
  }
}
