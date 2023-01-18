import { PostAction as Action, UserAction, PostTagAssociationAction } from 'action'
import { Post } from 'models'
import { Restful, isUndef, isDef } from 'utils'
import { CodeDictionary } from '@const'
import { PostType, PostTypeResponseCN } from '@models/Post'
import database from '@database'
import { broadcastMails, BroadcastMailsAttribute, template } from '@mailer'
import { getBlogConfig } from '@mailer/template/utils'

const BoardCastNewPost = async (postTitle: string, newPostUrl: string) => {
  const [blogConfig, subscribedUsers] = await Promise.all([
    getBlogConfig(),
    UserAction.RetrieveAllSubscribed(),
  ])
  const attributes: BroadcastMailsAttribute[] = await Promise.all(
    subscribedUsers.map(async (user) => {
      const emailTitle = `你订阅的博客: ${blogConfig.blogName} 发布了新帖 ${postTitle}`
      return {
        subject: emailTitle,
        html: await template.NewPost({
          title: emailTitle,
          postTitle,
          newPostUrl,
          userName: user.userName,
          blogConfig,
        }),
        accepter: {
          name: user.userName,
          address: user.email,
        },
      }
    }),
  )
  await broadcastMails(attributes)
}
/**
 * 添加帖子
 * @param { Post } post
 */
const Create = async (post: Post, tids: number[]): Promise<Restful> => {
  // Sequelize事务: https://www.sequelize.com.cn/other-topics/transactions
  // 创建事务
  const t = await database.transaction()
  try {
    // 除了说说以外都需要title
    if (post.type !== PostType.MOMENT && !post.title) {
      return new Restful(
        CodeDictionary.SERVICE_ERROR__POST_NEED_TITLE,
        '除说说以外的文章类型，标题是必需的',
      )
    }
    if (!post.content) {
      return new Restful(CodeDictionary.SERVICE_ERROR__POST_NEED_CONTENT, '文章内容不能为空')
    }
    const values = await Promise.all([Action.Create(post, t), getBlogConfig()])
    const _post = values[0]
    const blogConfig = values[1]
    // 如果帖子有标签
    const _tids = tids?.filter((tid) => isDef(tid))
    if (_tids?.length) {
      await PostTagAssociationAction.CreateBulk(
        _tids.map((tid) => ({ pid: _post.id, tid })), // 不采取Promise.all的原因是创建关联需要获取到post.id
        t,
      )
    }

    // 广播新帖订阅邮件，仅LANDSCAPE/POST且非隐藏非草稿广播
    if (
      !_post.isDraft &&
      !_post.isHidden &&
      (_post.type === PostType.LANDSCAPE || _post.type === PostType.POST)
    ) {
      await BoardCastNewPost(_post.title || '', _post.getUrl(blogConfig.publicPath))
    }

    // 提交事务
    await t.commit()
    await _post.reload()
    return new Restful(
      CodeDictionary.SUCCESS,
      `添加${PostTypeResponseCN[PostType[_post.type as PostType]] as string}成功`,
      _post.toJSON(),
    )
  } catch (e: any) {
    // 回退事务
    await t.rollback()
    return new Restful(CodeDictionary.COMMON_ERROR, `添加帖子失败, ${String(e.message)}`)
  }
}

/**
 * 通过id查询某个帖子
 * @param { number } id
 */
const RetrieveByID = async (
  id: number,
  showDrafts: boolean,
  showHidden: boolean,
): Promise<Restful> => {
  try {
    const post = await Action.RetrieveByID(id, showDrafts, showHidden)
    if (isUndef(post)) {
      return new Restful(CodeDictionary.RETRIEVE_ERROR__POST_NON_EXISTED, '帖子不存在')
    }
    await post.increment('pageViews')
    ;(post.pageViews as number)++
    return new Restful(CodeDictionary.SUCCESS, '查询成功', post.toJSON())
  } catch (e: any) {
    return new Restful(CodeDictionary.COMMON_ERROR, `查询失败, ${String(e.message)}`)
  }
}

/**
 * 按页查询
 * @param { string } page
 * @param { string } capacity
 * @param { PostType[] } postTypes?
 * @param { boolean } showDrafts = false
 * @param { boolean } showHidden = false
 * @param { string } isASC = '0'
 */
const RetrieveInPage = async (
  page: string,
  capacity: string,
  postTypes?: PostType[],
  showDrafts = false,
  showHidden = false,
  isASC = '0',
): Promise<Restful> => {
  try {
    const values = await Promise.all([
      Action.RetrieveInPage(
        (Number(page) - 1) * Number(capacity),
        Number(capacity),
        postTypes,
        showDrafts,
        showHidden,
        isASC === '1',
      ),
      Action.CountPages(postTypes, showDrafts, showHidden),
    ])
    const result = {
      posts: values[0],
      total: values[1],
    }
    return new Restful(CodeDictionary.SUCCESS, '查询成功', result)
  } catch (e: any) {
    return new Restful(CodeDictionary.COMMON_ERROR, `查询失败, ${String(e.message)}`)
  }
}

/**
 * 按标签和页查询
 * @param { string } page
 * @param { string } capacity
 * @param { string[] } tids
 * @param { PostType[] } postTypes = []
 * @param { boolean } showDrafts = false
 * @param { boolean } showHidden = false
 * @param { string } isASC = '0'
 */
const RetrieveInPageByTag = async (
  page: string,
  capacity: string,
  tids: string[],
  showDrafts = false,
  showHidden = false,
  isASC = '0',
): Promise<Restful> => {
  try {
    const postTypes = [PostType.LANDSCAPE, PostType.POST, PostType.PAGE]
    const values = await Promise.all([
      Action.RetrieveInPageByTag(
        (Number(page) - 1) * Number(capacity),
        Number(capacity),
        postTypes,
        tids.map((tid) => Number(tid)),
        showDrafts,
        showHidden,
        isASC === '1',
      ),
      Action.CountPagesByTag(
        postTypes,
        showDrafts,
        showHidden,
        tids.map((tid) => Number(tid)),
      ),
    ])
    const result = {
      posts: values[0],
      total: values[1],
    }
    return new Restful(CodeDictionary.SUCCESS, '查询成功', result)
  } catch (e: any) {
    return new Restful(CodeDictionary.COMMON_ERROR, `查询失败, ${String(e.message)}`)
  }
}

/**
 * 编辑帖子
 * @param { any } post
 * @param { number[] } tids
 */
const Edit = async (post: any, tids: number[]): Promise<Restful> => {
  const t = await database.transaction()
  try {
    const existedPost = await Action.RetrieveByID(post.id as number, true, true)
    if (isUndef(existedPost)) {
      return new Restful(CodeDictionary.RETRIEVE_ERROR__POST_NON_EXISTED, '帖子不存在')
    }
    // 除了说说以外都需要title
    if (post.type !== PostType.MOMENT && !post.title) {
      return new Restful(
        CodeDictionary.SERVICE_ERROR__POST_NEED_TITLE,
        '除说说以外的文章类型，标题是必需的',
      )
    }
    if (!post.content) {
      return new Restful(CodeDictionary.SERVICE_ERROR__POST_NEED_CONTENT, '文章内容不能为空')
    }
    const tagTransaction = new Promise<any>((resolve, reject) => {
      // 先删除该帖子上的所有标签关联
      // 然后再创建
      PostTagAssociationAction.DeleteBulk(post.id as number, t)
        .then(() => {
          const _tids = tids.filter((tid) => isDef(tid))
          if (_tids.length) {
            return PostTagAssociationAction.CreateBulk(
              _tids.map((tid) => ({ pid: post.id, tid })),
              t,
            )
          }
        })
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
    const [newPost, blogConfig] = await Promise.all([
      Action.Update(existedPost, post, t),
      getBlogConfig(),
      tagTransaction,
    ])

    // 广播新帖订阅邮件，仅LANDSCAPE/POST且非隐藏非草稿广播
    if (
      !newPost.isDraft &&
      !newPost.isHidden &&
      (newPost.type === PostType.LANDSCAPE || newPost.type === PostType.POST) &&
      existedPost.type !== PostType.LANDSCAPE &&
      existedPost.type !== PostType.POST
    ) {
      await BoardCastNewPost(
        newPost.title || '',
        `${blogConfig.publicPath}/${PostType[newPost.type as PostType]}/${String(newPost.id)}`,
      )
    }

    await t.commit()
    return new Restful(CodeDictionary.SUCCESS, '编辑成功', newPost.toJSON())
  } catch (e: any) {
    await t.rollback()
    return new Restful(CodeDictionary.COMMON_ERROR, `编辑失败, ${String(e.message)}`)
  }
}

/**
 * 删除帖子（公开接口）
 * @description 不能删除非自己的帖子
 * @param { string } id
 * @param { string } uid
 */
const Delete = async (id: string, uid: string): Promise<Restful> => {
  try {
    const existedPost = await Action.RetrieveByID(Number(id))
    if (isUndef(existedPost)) {
      return new Restful(CodeDictionary.RETRIEVE_ERROR__POST_NON_EXISTED, '帖子不存在')
    }
    if (existedPost.uid !== Number(uid)) {
      return new Restful(CodeDictionary.DELETE_ERROR__POST_NO_PERMISSION, '不能删除他人帖子')
    }
    const deleteRow = await Action.Delete(Number(id))
    return deleteRow > 0
      ? new Restful(CodeDictionary.SUCCESS, '删除帖子成功')
      : new Restful(CodeDictionary.DELETE_ERROR__POST, '删除帖子失败')
  } catch (e: any) {
    return new Restful(CodeDictionary.COMMON_ERROR, `删除帖子失败, ${String(e.message)}`)
  }
}

/**
 * 删除帖子（管理员接口）
 * @param { string } id
 * @param { string } uid
 */
const DeleteByAdmin = async (id: string): Promise<Restful> => {
  try {
    const existedPost = await Action.RetrieveByID(Number(id))
    if (isUndef(existedPost)) {
      return new Restful(CodeDictionary.RETRIEVE_ERROR__POST_NON_EXISTED, '帖子不存在')
    }
    const deleteRow = await Action.Delete(Number(id))
    return deleteRow > 0
      ? new Restful(CodeDictionary.SUCCESS, '删除帖子成功')
      : new Restful(CodeDictionary.DELETE_ERROR__POST, '删除帖子失败')
  } catch (e: any) {
    return new Restful(CodeDictionary.COMMON_ERROR, `删除帖子失败, ${String(e.message)}`)
  }
}

/**
 * 点赞帖子
 * @param { number } id
 */
const Like = async (id: number): Promise<Restful> => {
  try {
    const existedPost = await Action.RetrieveByID(id)
    if (isUndef(existedPost)) {
      return new Restful(CodeDictionary.RETRIEVE_ERROR__POST_NON_EXISTED, '此帖子已不存在')
    }
    await existedPost.increment('likesCount')
    return new Restful(CodeDictionary.SUCCESS, '点赞成功')
  } catch (e: any) {
    return new Restful(CodeDictionary.COMMON_ERROR, `点赞帖子失败, ${String(e.message)}`)
  }
}

/**
 * 踩帖子
 * @param { number } id
 */
const Dislike = async (id: number): Promise<Restful> => {
  try {
    const existedPost = await Action.RetrieveByID(id)
    if (isUndef(existedPost)) {
      return new Restful(CodeDictionary.RETRIEVE_ERROR__POST_NON_EXISTED, '此帖子已不存在')
    }
    await existedPost.increment('dislikesCount')
    return new Restful(CodeDictionary.SUCCESS, '踩成功')
  } catch (e: any) {
    return new Restful(CodeDictionary.COMMON_ERROR, `踩帖子失败, ${String(e.message)}`)
  }
}

export default {
  Create,
  RetrieveByID,
  RetrieveInPage,
  RetrieveInPageByTag,
  Edit,
  Delete,
  DeleteByAdmin,
  Like,
  Dislike,
}
