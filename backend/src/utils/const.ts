export const QUERY_METHODS = ['GET']
export const BODY_METHODS = ['POST', 'PUT', 'DELETE']

// 白名单，不需要JWT
export const ROUTER_WHITE_LIST = [
  // init
  'init',
  // test
  'test',
  // user
  'user/init',
  'user/register',
  'user/login',
  'user/retrieve',
  // post
  'post/retrieve-id',
  'post/retrieve',
  'post/retrieve-tag',
  'post/like',
  'post/dislike',
  // post-comment
  'post-comment/create',
  'post-comment/retrieve-pid',
  'post-comment/like',
  'post-comment/dislike',
  // post-tag
  'post-tag/retrieve',
  'post-tag/retrieve-slug',
  // captcha,
  'captcha/get',
  // template,
  'template',
  // option
  'option/retrieve',
].map((v) => `/api/${v}`)

// 只有管理员和超级管理员可以访问的接口
export const ROUTER_ADMIN_ALLOW = [
  // user
  'user/edit-admin',
  'user/delete-admin',
  // post
  'post/create',
  'post/retrieve-id-admin',
  'post/retrieve-admin',
  'post/retrieve-tag-admin',
  'post/edit',
  'post/edit-admin',
  'post/delete',
  'post/delete-admin',
  // comment
  'post-comment/delete-admin',
  // post-tag
  'post-tag/create-admin',
  'post-tag/edit-admin',
  'post-tag/delete-admin',
  // mail
  'mail/retrieve-admin',
  'mail/edit-admin',
  // option
  'option/save-admin',
].map((v) => `/api/${v}`)

// 只有超级管理员可以访问的接口
export const ROUTER_SUPER_ADMIN_ALLOW = [
  // init
  'init/force-admin',
  'init/table-rows-admin',
  'option/save-admin',
].map((v) => `/api${v}`)

export const isDev = process.env.NODE_ENV === 'development'

export enum CodeDictionary {
  SUCCESS = 0,
  // Init
  INIT_ERROR__DATABASE_ERROR,
  INIT_ERROR__DATABASE_EXISTED,
  INIT_ERROR__USERACCOUNT_EXISTED,
  // User
  REGISTER_ERROR__NOT_INIT,
  REGISTER_ERROR__USER_ACCOUNT_EXISTED,
  REGISTER_ERROR__NO_CAPTCHA,
  REGISTER_ERROR__ERROR_CAPTCHA,
  REGISTER_ERROR__CAPTCHA_EXPIRED,
  LOGIN_ERROR,
  RETRIEVE_ERROR__USER_NON_EXISTED,
  DELETE_ERROR__USER,
  DELETE_ERROR__USER_ADMIN,
  EXPIRED_LOGIN,
  EDIT_ERROR__NO_PERMISSION,
  // Post
  SERVICE_ERROR__POST_NEED_TITLE,
  SERVICE_ERROR__POST_NEED_CONTENT,
  RETRIEVE_ERROR__POST_NON_EXISTED,
  DELETE_ERROR__POST_NO_PERMISSION,
  DELETE_ERROR__POST,
  // PostComment
  SERVICE_ERROR__COMMENT_POST_NON_EXISTED,
  SERVICE_ERROR__COMMENT_POST_IS_LOCKED,
  SERVICE_ERROR__COMMENT_PARENT_COMMENT_NON_EXISTED,
  SERVICE_ERROR__COMMENT_NON_EXISTED,
  DELETE_ERROR__COMMENT,
  SERVICE_ERROR__COMMENT_USER_NON_EXISTED,
  SERVICE_ERROR__COMMENT_EMAIL_NEEDED,
  // PostTag
  SERVICE_ERROR__TAG_EXISTED,
  SERVICE_ERROR__TAG_NON_EXISTED,
  // MailCaptcha
  SERVICE_ERROR__CAPTCHA_USER_EXISTED,
  // Option
  SERVICE_ERROR__OPTION_NEEDED,
  SERVICE_ERROR__OPTION_EXISTED,
  // Email
  EMAIL_ERROR__USER_NOT_INIT,
  EMAIL_ERROR__NOT_ACTIVE,
  EMAIL_ERROR__NON_EXISTED,
  // OTHER
  UPLOAD_TYPE_ERROR,
  PARAMS_ERROR = 98,
  COMMON_ERROR = 99,
  JWT_ERROR__REQUIRED = 100,
  JWT_ERROR__EXPIRED = 101,
}
