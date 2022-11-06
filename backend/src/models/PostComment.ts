import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize'
import sequelize from 'database'
import Post from './Post'
import User from './User'

class PostComment extends Model<
  InferAttributes<PostComment>,
  InferCreationAttributes<PostComment>
> {
  public declare id: CreationOptional<number>
  public declare rootId?: number
  public declare parentId?: number
  public declare pid: number
  public declare uid: number
  public declare content: string
  public declare email: string
  public declare url?: string
  public declare ip: string
  public declare userAgent?: string
  public declare likesCount?: number
  public declare dislikesCount?: number
  public declare readonly createdAt?: Date
  public declare readonly updatedAt?: Date
}

export interface PostCommentWithAuthor extends PostComment {
  author?: User
}

PostComment.init(
  {
    id: {
      comment: '评论id',
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    rootId: {
      comment: '根评论id',
      type: DataTypes.INTEGER.UNSIGNED,
    },
    parentId: {
      comment: '父评论id',
      type: DataTypes.INTEGER.UNSIGNED,
    },
    pid: {
      comment: '评论所处帖子id',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      /**
       * < references >
       * @description Sequelize关联模型
       * @example https://www.sequelize.com.cn/core-concepts/assocs
       */
      references: {
        model: Post,
        key: 'id',
      },
    },
    uid: {
      comment: '评论用户id, 2 代表未注册用户',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 2,
    },
    content: {
      comment: '评论内容',
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      comment: 'email',
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        isEmail: { msg: '请输入邮箱格式' },
        notNull: { msg: '邮箱不能为空' },
        notEmpty: { msg: '邮箱不能为空' },
      },
    },
    url: {
      comment: '个人网站',
      type: DataTypes.STRING(512),
    },
    ip: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        isIP: { msg: 'IP 格式错误' },
      },
    },
    userAgent: {
      comment: '用户代理',
      type: DataTypes.STRING(200),
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
  },
)

export default PostComment
