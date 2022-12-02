import { createModel } from '@rematch/core'
import { RootModel } from '@/models'
import { AssociatedPost } from '@/utils/Request/Post'
import { AssociatedPostComment } from '@/utils/Request/PostComment'
export interface PostDetailState {
  post: AssociatedPost | null
  replyComment: AssociatedPostComment | null
}

export const defaultPostDetailState: PostDetailState = {
  post: null,
  replyComment: null,
}

export const postDetail = createModel<RootModel>()({
  state: defaultPostDetailState,
  reducers: {
    setPost: (state: PostDetailState, post: AssociatedPost | null) => {
      state.post = post
      return state
    },
    setReplyCommentBox: (state: PostDetailState, replyComment: PostDetailState['replyComment']) => {
      state.replyComment = replyComment
      return state
    },
  },
})
