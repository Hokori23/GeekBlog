import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize'
import sequelize from 'database'
import User from './User'
import PostComment from './PostComment'

/**
 * @description 添加字段同时要更改相应字段的validate属性
 * @example
 * validate: {
 *   min: PostType.POST,
 *   max: PostType.PAGE,
 * },
 */
export enum PostType {
  POST = 0,
  LANDSCAPE = 1,
  MOMENT = 2,
  PAGE = 3, // TODO: 自定义页面
}

export enum PostTypeCN {
  POST = '帖子',
  LANDSCAPE = '沉浸式背景',
  MOMENT = '说说',
  PAGE = '自定义页面',
}

export enum PostTypeResponseCN {
  POST = '帖子',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  LANDSCAPE = '帖子',
  MOMENT = '说说',
  PAGE = '自定义页面',
}

export enum Toggle {
  N = 0,
  Y = 1,
}
class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  public declare id: CreationOptional<number>
  public declare uid: number
  public declare title?: string
  public declare coverUrl?: string
  public declare content: string
  public declare type?: PostType
  public declare draftContent?: string
  public declare isDraft?: Toggle
  public declare isHidden?: Toggle
  public declare isLocked?: Toggle
  public declare priority?: number
  public declare likesCount?: number
  public declare dislikesCount?: number
  public declare pageViews?: number

  public declare postComments?: PostComment[]

  public declare readonly createdAt?: Date
  public declare readonly updatedAt?: Date

  public getUrl(publicPath: string) {
    return `${publicPath}/post/detail/${String(this.id)}`
  }
}

Post.init(
  {
    id: {
      comment: '帖子id',
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    uid: {
      comment: '发帖用户id',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      /**
       * < references >
       * @description Sequelize关联模型
       * @example https://www.sequelize.com.cn/core-concepts/assocs
       */
      references: {
        model: User,
        key: 'id',
      },
    },
    title: {
      comment: '帖子标题',
      type: DataTypes.STRING(50),
    },
    coverUrl: {
      comment: '封面图片路径',
      type: DataTypes.STRING(2083),
    },
    content: {
      comment: '帖子内容',
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: '帖子内容不能为空' },
        notEmpty: { msg: '帖子内容不能为空' },
      },
    },
    type: {
      comment: '帖子类型',
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: PostType.POST,
      validate: {
        min: PostType.POST,
        max: PostType.PAGE,
      },
    },
    draftContent: {
      comment: '草稿内容',
      type: DataTypes.TEXT,
    },
    isDraft: {
      comment: '是否为草稿',
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: Toggle.N,
    },
    isHidden: {
      comment: '是否隐藏',
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: Toggle.N,
    },
    isLocked: {
      comment: '是否封锁评论区',
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: Toggle.N,
    },
    priority: {
      comment: '置顶优先级',
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    likesCount: {
      comment: '点赞数',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    dislikesCount: {
      comment: '踩',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    pageViews: {
      comment: '文章浏览量',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
  },
)

export default Post
