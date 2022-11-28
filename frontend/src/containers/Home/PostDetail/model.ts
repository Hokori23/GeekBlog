import { createModel } from '@rematch/core'
import { RootModel } from '@/models'
import { AssociatedPost } from '@/utils/Request/Post'
export interface PostDetailState {
  post?: AssociatedPost | null
}

export const defaultPostDetailState: PostDetailState = {
  post: null,
}

export const postDetail = createModel<RootModel>()({
  state: defaultPostDetailState,
  reducers: {
    setPost: (state: PostDetailState, post?: AssociatedPost | null) => {
      state.post = post
      return state
    },
  },
})
