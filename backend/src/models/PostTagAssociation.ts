import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize'
import sequelize from 'database'
import PostTag from './PostTag'
import Post from './Post'

class PostTagAssociation extends Model<
  InferAttributes<PostTagAssociation>,
  InferCreationAttributes<PostTagAssociation>
> {
  public declare id: CreationOptional<number>
  public declare pid: number
  public declare tid: number
  public declare readonly createdAt?: Date
  public declare readonly updatedAt?: Date
}

PostTagAssociation.init(
  {
    id: {
      comment: '自增字段（主键）',
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    pid: {
      comment: '帖子id',
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Post,
        key: 'id',
      },
    },
    tid: {
      comment: '帖子标签id',
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: PostTag,
        key: 'id',
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
  },
)

export default PostTagAssociation
