import { Models } from '@rematch/core'
import { postDetail } from '@/containers/Home/PostDetail/model'

import { common } from './common-model'

export interface RootModel extends Models<RootModel> {
  postDetail: typeof postDetail
  common: typeof common
}

export const models: RootModel = {
  postDetail,
  common,
}
