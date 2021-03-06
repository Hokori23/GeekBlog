import {
  DataTypes,
  Model,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin
} from 'sequelize';

import { PostTag, PostComment } from '@vo';
import DB from '@database';

interface PostAttributes {
  id: number | null;
  user_account: string;
  title: string | null;
  content: string;
  view_count: number;
  comment_count: number;
  is_draft: boolean;
  is_hidden: boolean;
  is_locked: boolean;
  is_sticky: boolean;
  type: number;
  cover_url: string | null;
  createdAt: Date;
  updatedAt: Date;

  PostTags: Array<PostTag>;
  PostComments: Array<PostComment>;
}

class Post extends Model implements PostAttributes {
  public id!: number | null;
  public user_account!: string;
  public title!: string | null;
  public content!: string;
  public view_count!: number;
  public comment_count!: number;
  public is_draft!: boolean;
  public is_hidden!: boolean;
  public is_locked!: boolean;
  public is_sticky!: boolean;
  public type!: number;
  public cover_url!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getPostTags!: HasManyGetAssociationsMixin<PostTag>;
  public addPostTag!: HasManyAddAssociationMixin<PostTag, number>;
  public hasPostTag!: HasManyHasAssociationMixin<PostTag, number>;
  public countPostTags!: HasManyCountAssociationsMixin;
  public createPostTag!: HasManyCreateAssociationMixin<PostTag>;
  public PostTags!: Array<PostTag>;

  public getPostComments!: HasManyGetAssociationsMixin<PostComment>;
  public addPostComment!: HasManyAddAssociationMixin<PostComment, number>;
  public hasPostComment!: HasManyHasAssociationMixin<PostComment, number>;
  public countPostComments!: HasManyCountAssociationsMixin;
  public createPostComment!: HasManyCreateAssociationMixin<PostComment>;
  public PostComments!: Array<PostComment>;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      comment: '????????????????????????'
    },
    user_account: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notNull: {
          msg: '??????????????????'
        },
        notEmpty: {
          msg: '??????????????????'
        },
        len: {
          args: [5, 20],
          msg: '??????????????????5???20??????'
        }
      },
      comment: '????????????'
    },
    title: {
      type: DataTypes.STRING(50),
      validate: {
        len: {
          args: [0, 50],
          msg: '?????????????????????50??????'
        }
      },
      comment: '????????????'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: '????????????????????????'
        },
        notEmpty: {
          msg: '????????????????????????'
        }
      },
      comment: '????????????'
    },
    view_count: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '?????????'
    },
    comment_count: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
      comment: '?????????'
    },
    is_draft: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: '??????'
    },
    is_hidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: '????????????'
    },
    is_locked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: '????????????'
    },
    is_sticky: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
      comment: '????????????or???????????????'
    },
    type: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 2,
        isInt: true
      },
      comment: '??????????????????: { 0: ??????, 1: LandScape??????, 2: ?????? }'
    },
    cover_url: {
      type: DataTypes.STRING(100),
      comment: '????????????????????????'
    }
  },
  {
    sequelize: DB,
    tableName: 'post'
  }
);
export default Post;
