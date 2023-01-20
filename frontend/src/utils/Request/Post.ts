import { Request } from '.'
import { AssociatedPostComment } from './PostComment'
import { WithPostTags } from './PostTag'
import { Restful, _Restful } from './type'
import { WithAuthor } from './User'

const baseUrl = '/api/post'

export enum PostType {
  POST = 0,
  LANDSCAPE = 1,
  MOMENT = 2,
  PAGE = 3, // TODO: 自定义页面
}
export enum Toggle {
  N = 0,
  Y = 1,
}

export interface Post {
  id?: number
  uid: number
  title?: string
  coverUrl?: string
  content: string
  type?: PostType
  draftContent?: string
  isDraft: Toggle
  isHidden: Toggle
  isLocked: Toggle
  priority: number
  likesCount: number
  dislikesCount: number
  pageViews: number

  postComments?: AssociatedPostComment[]

  readonly createdAt: Date
  readonly updatedAt: Date
}

export type AssociatedPost = WithAuthor<WithPostTags<Post>>

export interface EditedPost extends Post {
  tags: number[] | undefined
}

export interface Posts {
  posts: AssociatedPost[]
  total: number
}

export const Create = async ({ post, tids }: PostRequest) => {
  return await Request<Restful<AssociatedPost>>({
    method: 'POST',
    data: { post, tids },
    url: `${baseUrl}/create`,
  })
}

export const Retrieve = async (id: number) => {
  return await Request<Restful<AssociatedPost>>({
    method: 'GET',
    params: {
      id,
    },
    url: `${baseUrl}/retrieve-id`,
  })
}

export const RetrieveByAdmin = async (id: number) => {
  return await Request<Restful<AssociatedPost>>({
    method: 'GET',
    params: {
      id,
    },
    url: `${baseUrl}/retrieve-id-admin`,
  })
}

export const RetrieveAll = async (params: {
  page: number
  capacity: number
  isASC: Toggle
  postTypes: PostType[]
}) => {
  return await Request<Restful<Posts>>({
    method: 'GET',
    params,
    url: `${baseUrl}/retrieve`,
  })
}

export const RetrieveAll__Admin = async (
  page: number,
  capacity: number,
  isASC: Toggle,
  postTypes: PostType[] = [],
) => {
  return await Request<Restful<Posts>>({
    method: 'GET',
    params: {
      page,
      capacity,
      isASC,
      postTypes,
    },
    url: `${baseUrl}/retrieve-admin`,
  })
}

export const RetrieveTag = async (params: {
  page: number
  capacity: number
  isASC: Toggle
  tids: number[]
}) => {
  return await Request<Restful<Posts>>({
    method: 'GET',
    params,
    url: `${baseUrl}/retrieve-tag`,
  })
}

export const RetrieveTag__Admin = async (
  page: number,
  capacity: number,
  isASC: Toggle,
  tids: number[],
) => {
  return await Request<Restful<Posts>>({
    method: 'GET',
    params: {
      page,
      capacity,
      tids,
      isASC,
    },
    url: `${baseUrl}/retrieve-tag-admin`,
  })
}

export interface PostRequest {
  post: Partial<EditedPost>
  tids: number[] | undefined
}

export const Edit = async ({ post, tids }: PostRequest) => {
  return await Request<Restful<AssociatedPost>>({
    method: 'POST',
    data: { post, tids },
    url: `${baseUrl}/edit`,
  })
}

export const EditByAdmin = async ({ post, tids }: PostRequest) => {
  return await Request<Restful<AssociatedPost>>({
    method: 'POST',
    data: { post, tids },
    url: `${baseUrl}/edit-admin`,
  })
}

export const Delete = async (id: number) => {
  return await Request<Restful<Post>>({
    method: 'POST',
    data: {
      id,
    },
    url: `${baseUrl}/delete`,
  })
}

export const DeleteByAdmin = async (id: number) => {
  return await Request<_Restful>({
    method: 'POST',
    data: {
      id,
    },
    url: `${baseUrl}/delete-admin`,
  })
}

export const Like = async (id: number) => {
  return await Request<_Restful>({
    method: 'POST',
    data: {
      id,
    },
    url: `${baseUrl}/like`,
  })
}

export const Dislike = async (id: number) => {
  return await Request<_Restful>({
    method: 'POST',
    data: {
      id,
    },
    url: `${baseUrl}/dislike`,
  })
}
