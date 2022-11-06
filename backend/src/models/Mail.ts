import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize'
import sequelize from 'database'
import { Toggle } from './Post'
import User from './User'

class Mail extends Model<InferAttributes<Mail>, InferCreationAttributes<Mail>> {
  public declare id: CreationOptional<number>
  public declare uid: number
  public declare isSubscribed?: boolean
  public declare readonly createdAt?: Date
  public declare readonly updatedAt?: Date
}

Mail.init(
  {
    id: {
      comment: '自增字段（主键）',
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    uid: {
      comment: '发帖用户id',
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: 'uid',
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
    isSubscribed: {
      comment: '是否订阅',
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: Toggle.N,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
  },
)

export default Mail
