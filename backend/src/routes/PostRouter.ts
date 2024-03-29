import { Router } from 'express'

import { PostService as Service } from '@service'
import { Post } from '@models'
import { Restful, checkIntegrity, isNaN, isUndef, isPrimitiveArray, PrimitiveType } from '@utils'
import { CodeDictionary } from '@const'
import { PostType } from '@models/Post'

const postRouter = Router()

const isValidPostType = (postTypes: any): postTypes is string[] => {
  return isUndef(postTypes) || isPrimitiveArray(postTypes, PrimitiveType.string)
}

/**
 * 添加帖子
 * @path /create
 * @param { Post } post
 * @description --即使没有标签也要给一个空数组 -- tids: []
 */
postRouter.post('/create', async (req, res, next) => {
  const post = Post.build(req.body.post)
  const { tids } = req.body
  if (isUndef(tids) || !checkIntegrity(post, ['uid', 'content'])) {
    res.status(200).json(new Restful(CodeDictionary.PARAMS_ERROR, '参数错误'))
    return next()
  }
  try {
    res.status(200).json(await Service.Create(post, tids))
  } catch (e) {
    // TODO: 进行邮件提醒
    res.status(500).end()
  }
  next()
})

/**
 * 通过ID查询
 * @path /retrieve-id（公共接口）
 * @param { string } id
 */
postRouter.get('/retrieve-id', async (req, res, next) => {
  const { id } = req.query
  try {
    if (isNaN(id)) {
      res.status(200).json(new Restful(CodeDictionary.PARAMS_ERROR, '参数错误'))
    } else {
      res.status(200).json(await Service.RetrieveByID(Number(id), false, false))
    }
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end()
  }
  next()
})

/**
 * 通过ID查询
 * @path /retrieve-id-admin
 * @param { string } id
 */
postRouter.get('/retrieve-id-admin', async (req, res, next) => {
  const { id } = req.query
  try {
    if (isNaN(id)) {
      res.status(200).json(new Restful(CodeDictionary.PARAMS_ERROR, '参数错误'))
    } else {
      // TODO: showDrafts, showHidden
      res.status(200).json(await Service.RetrieveByID(Number(id), true, true))
    }
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end()
  }
  next()
})

/**
 * 按页查询（公开接口）
 * @path /retrieve
 * @param { string } page
 * @param { string } capacity
 * @param { PostType[] } postTypes?
 * @param { string } page
 */
postRouter.get('/retrieve', async (req, res, next) => {
  const { page, capacity, isASC, postTypes } = req.query
  try {
    if (isNaN(page) || isNaN(capacity) || isNaN(isASC) || !isValidPostType(postTypes)) {
      res.status(200).json(new Restful(CodeDictionary.PARAMS_ERROR, '参数错误'))
    } else {
      res
        .status(200)
        .json(
          await Service.RetrieveInPage(
            page as string,
            capacity as string,
            postTypes as unknown as PostType[],
            false,
            false,
            isASC as string,
          ),
        )
    }
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end()
  }
  next()
})

/**
 * 按页查询
 * @path /retrieve-admin
 * @param { string } page
 * @param { string } capacity
 * @param { PostType[] } postTypes?
 * @param { string } page
 */
postRouter.get('/retrieve-admin', async (req, res, next) => {
  const { page, capacity, isASC, postTypes } = req.query
  try {
    if (isNaN(page) || isNaN(capacity) || isNaN(isASC) || !isValidPostType(postTypes)) {
      res.status(200).json(new Restful(CodeDictionary.PARAMS_ERROR, '参数错误'))
    } else {
      res
        .status(200)
        .json(
          await Service.RetrieveInPage(
            page as string,
            capacity as string,
            postTypes as unknown as PostType[],
            true,
            true,
            isASC as string,
          ),
        )
    }
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end()
  }
  next()
})

/**
 * 按标签和页查询（公开接口）
 * @path /retrieve-tag
 * @param { string } page
 * @param { string } capacity
 * @param { number[] } tids // TODO
 * @param { string } page
 */
postRouter.get('/retrieve-tag', async (req, res, next) => {
  const { page, capacity, tids, isASC } = req.query
  try {
    if (
      isNaN(page) ||
      isNaN(capacity) ||
      isNaN(tids) ||
      isNaN(isASC) ||
      !(tids as string[]).length
    ) {
      res.status(200).json(new Restful(CodeDictionary.PARAMS_ERROR, '参数错误'))
    } else {
      res
        .status(200)
        .json(
          await Service.RetrieveInPageByTag(
            page as string,
            capacity as string,
            tids as string[],
            false,
            false,
            isASC as string,
          ),
        )
    }
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end()
  }
  next()
})

/**
 * 按标签和页查询
 * @path /retrieve-tag-admin
 * @param { string } page
 * @param { string } capacity
 * @param { number[] } tids
 * @param { string } page
 */
postRouter.get('/retrieve-tag-admin', async (req, res, next) => {
  const { page, capacity, tids, isASC } = req.query
  try {
    if (
      isNaN(page) ||
      isNaN(capacity) ||
      isNaN(tids) ||
      isNaN(isASC) ||
      !(tids as string[]).length
    ) {
      res.status(200).json(new Restful(CodeDictionary.PARAMS_ERROR, '参数错误'))
    } else {
      res
        .status(200)
        .json(
          await Service.RetrieveInPageByTag(
            page as string,
            capacity as string,
            tids as string[],
            true,
            true,
            isASC as string,
          ),
        )
    }
  } catch (e) {
    // 进行邮件提醒
    res.status(500).end()
  }
  next()
})

/**
 * 编辑自己帖子
 * @path /edit
 * @param { object } param: { Post, tids[]}
 * @param { Post } post
 * @param { number[] } tids = []
 */
postRouter.post('/edit', async (req: any, res, next) => {
  try {
    const { post, tids } = req.body
    if (isUndef(post) || !checkIntegrity(post, ['id', 'uid', 'content']) || isNaN(tids)) {
      res.status(200).json(new Restful(CodeDictionary.PARAMS_ERROR, '参数错误'))
      return next()
    }
    if (req.auth.id !== post.uid) {
      res.status(403).end()
      return next()
    }
    res.status(200).json(await Service.Edit(post, tids))
  } catch (e) {
    // TODO: 进行邮件提醒
    res.status(500).end()
  }
  next()
})

/**
 * 编辑帖子
 * @path /edit-admin
 * @param { object } param: { Post, tids[]}
 * @param { Post } post
 * @param { number[] } tids
 */
postRouter.post('/edit-admin', async (req: any, res, next) => {
  try {
    const { post, tids } = req.body
    if (isUndef(post) || !checkIntegrity(post, ['id', 'uid', 'content']) || isNaN(tids)) {
      res.status(200).json(new Restful(CodeDictionary.PARAMS_ERROR, '参数错误'))
      return next()
    }
    res.status(200).json(await Service.Edit(post, tids))
  } catch (e) {
    // TODO: 进行邮件提醒
    res.status(500).end()
  }
  next()
})

/**
 * 删除帖子
 * @path /delete
 * @param { string } id // 帖子id
 */
postRouter.post('/delete', async (req: any, res, next) => {
  try {
    const { id } = req.body
    if (isNaN(id)) {
      res.status(200).json(new Restful(CodeDictionary.PARAMS_ERROR, '参数错误'))
      return next()
    }
    res.status(200).json(await Service.Delete(id, req.auth.id))
  } catch (e) {
    // TODO: 进行邮件提醒
    res.status(500).end()
  }
  next()
})

/**
 * 删除帖子
 * @path /delete-admin
 * @param { string } id // 帖子id
 */
postRouter.post('/delete-admin', async (req: any, res, next) => {
  try {
    const { id } = req.body
    if (isNaN(id)) {
      res.status(200).json(new Restful(CodeDictionary.PARAMS_ERROR, '参数错误'))
      return next()
    }
    res.status(200).json(await Service.DeleteByAdmin(id))
  } catch (e) {
    // TODO: 进行邮件提醒
    res.status(500).end()
  }
  next()
})

/**
 * 点赞帖子
 * @path /like
 */
postRouter.post('/like', async (req, res, next) => {
  const { id } = req.body
  if (isUndef(id)) {
    res.status(200).json(new Restful(CodeDictionary.PARAMS_ERROR, '参数错误'))
    return next()
  }
  try {
    res.status(200).json(await Service.Like(id))
  } catch (e) {
    // TODO: 进行邮件提醒
    res.status(500).end()
  }
  next()
})

/**
 * 踩帖子
 * @path /dislike
 */
postRouter.post('/dislike', async (req, res, next) => {
  const { id } = req.body
  if (isUndef(id)) {
    res.status(200).json(new Restful(CodeDictionary.PARAMS_ERROR, '参数错误'))
    return next()
  }
  try {
    res.status(200).json(await Service.Dislike(id))
  } catch (e) {
    // TODO: 进行邮件提醒
    res.status(500).end()
  }
  next()
})

export default postRouter
