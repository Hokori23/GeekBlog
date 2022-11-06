import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize'
import sequelize from 'database'

class MailCaptcha extends Model<
  InferAttributes<MailCaptcha>,
  InferCreationAttributes<MailCaptcha>
> {
  public declare id: CreationOptional<number>
  public declare email: string
  public declare captcha: string
  public declare readonly createdAt?: Date
  public declare readonly updatedAt?: Date
}

MailCaptcha.init(
  {
    id: {
      comment: '自增字段（主键）',
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      comment: '欲验证邮箱',
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: 'email',
    },
    captcha: {
      comment: '邮箱验证码',
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
  },
)

export default MailCaptcha
