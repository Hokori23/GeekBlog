import { PostTag } from '@models'
import { Op } from 'sequelize'

/**
 * 添加标签
 * @param { PostTag } postTag
 */
const Create = async (postTag: PostTag): Promise<PostTag> => {
  return await postTag.save()
}

/**
 * 删除标签
 * @param { number } id
 */
const Delete = async (id: number): Promise<number> => {
  return await PostTag.destroy({
    where: {
      id,
    },
  })
}

/**
 * 编辑标签信息
 * @param { PostTag } oldTag
 * @param { PostTag } newTag
 */
const Update = async (oldTag: PostTag, newTag: PostTag): Promise<PostTag> => {
  return await Object.assign(oldTag, newTag).save()
}

/**
 * 通过某个字段查询标签
 * @param { string } param
 * @param { string } value
 */
const Retrieve = async (key: string, value: string | number): Promise<PostTag | null> => {
  return await PostTag.findOne({
    where: {
      [`${key}`]: value,
    },
  })
}

/**
 * 通过某个字段查询标签（除了某id）
 * @param { string } param
 * @param { string } value
 * @param { number } id
 */
const RetrieveExcludeID = async (
  key: string,
  value: string | number,
  id: number,
): Promise<PostTag | null> => {
  return await PostTag.findOne({
    where: {
      [`${key}`]: value,
      [Op.not]: {
        id,
      },
    },
  })
}

/**
 * 查询所有标签
 */
const RetrieveAll = async (): Promise<PostTag[]> => {
  return await PostTag.findAll()
}

/**
 * 分页查询标签
 * @param { number } offset
 * @param { number } limit
 * @param { boolean } isASC // 升序
 */
const RetrieveInPage = async (offset: number, limit: number, isASC = false): Promise<PostTag[]> => {
  return await PostTag.findAll({
    offset,
    limit,
    order: ['createdAt', isASC ? 'ASC' : 'DESC'],
  })
}

const CountPages = async (): Promise<number> => {
  return await PostTag.count()
}

export default {
  Create,
  Delete,
  Update,
  Retrieve,
  RetrieveExcludeID,
  RetrieveAll,
  RetrieveInPage,
  CountPages,
}
