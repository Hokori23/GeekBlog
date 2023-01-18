import { Request } from '.'
import { WithAuthor } from './User'
import { Restful, _Restful } from './type'

const baseUrl = '/api/post-comment'
export interface PostComment {
  id: number
  rootId?: number
  parentId?: number
  pid: number
  uid: number
  content: string
  email: string
  url?: string
  ip: string
  userAgent?: string
  likesCount: number
  dislikesCount: number
  readonly createdAt: Date
  readonly updatedAt: Date
}

export type AssociatedPostComment = WithAuthor<PostComment>

export interface FormattedPostComment extends AssociatedPostComment {
  children?: FormattedPostComment[]
  parent?: FormattedPostComment
}

export const Create = async (comment: Partial<PostComment>) => {
  return await Request<Restful<AssociatedPostComment>>({
    // TODO 这里后端要传一个带author的commentList
    method: 'POST',
    data: comment,
    url: `${baseUrl}/create`,
  })
}

export const RetrieveByPID = async (pid: number) => {
  return await Request<Restful<AssociatedPostComment[]>>({
    method: 'GET',
    data: {
      pid,
    },
    url: `${baseUrl}/retrieve-pid`,
  })
}

export const Delete = async (id: number) => {
  // TODO: 后端应该给一个新的comment列表
  return await Request<_Restful>({
    method: 'POST',
    data: { id },
    url: `${baseUrl}/delete-admin`,
  })
}

export const Like = async (id: number) => {
  return await Request<_Restful>({
    method: 'POST',
    data: { id },
    url: `${baseUrl}/like`,
  })
}

export const Dislike = async (id: number) => {
  return await Request<_Restful>({
    method: 'POST',
    data: { id },
    url: `${baseUrl}/dislike`,
  })
}
