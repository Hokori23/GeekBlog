import { UPYUN_URL } from '@/utils/const'
import { uploaderRequestHandler } from '@/utils/Request/Upload'

import { Uploader } from '@milkdown/plugin-upload'
import type { Node } from 'prosemirror-model'

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
