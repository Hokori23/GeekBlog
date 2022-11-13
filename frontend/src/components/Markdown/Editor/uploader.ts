import { UPYUN_URL } from '@/utils/const'
import { Upload } from '@/utils/Request'
import { CodeDictionary } from '@/utils/Request/type'
import { FileType } from '@/utils/Request/Upload'
import { Notification } from '@douyinfe/semi-ui'

import { Uploader } from '@milkdown/plugin-upload'
import type { Node } from 'prosemirror-model'

export const uploaderRequestHandler = async (image: File) => {
  const formData = new FormData()
  formData.append('file', image)
  const uploadRes = await Upload.handleUpload({ fileName: image.name, formData }, FileType.IMAGE)
  if (uploadRes?.code !== CodeDictionary.UPYUN_SUCCESS) {
    Notification.error({
      title: '警告',
      content: `上传图片失败: ${image.name}`,
    })
    return null
  }
  return uploadRes
}

const uploader: Uploader = async (files, schema) => {
  const images: File[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files.item(i)
    if (!file) {
      continue
    }

    // You can handle whatever the file type you want, we handle image here.
    if (!file.type.includes('image')) {
      continue
    }

    images.push(file)
  }

  const nodes: Node[] = (
    await Promise.all(
      images.map(async (image) => {
        const uploadRes = await uploaderRequestHandler(image)
        if (!uploadRes) {
          return {} as any
        }
        const src = `${UPYUN_URL}${uploadRes.url}`
        const alt = image.name
        return schema.nodes.image.createAndFill({
          src,
          alt,
        }) as Node
      }),
    )
  ).filter((v) => !!v)

  return nodes
}

export default uploader
