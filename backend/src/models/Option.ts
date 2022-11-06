import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize'
import sequelize from 'database'

export type OptionAttributes = InferAttributes<Option>

class Option extends Model<InferAttributes<Option>, InferCreationAttributes<Option>> {
  public declare module: string
  public declare key: string
  public declare value?: string
  public declare readonly createdAt?: Date
  public declare readonly updatedAt?: Date
}

Option.init(
  {
    module: {
      comment: '设置模块名',
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    key: {
      comment: '设置key值',
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    value: {
      comment: '设置value值',
      type: DataTypes.TEXT,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
  },
)

export default Option
