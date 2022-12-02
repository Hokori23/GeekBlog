module.exports = {
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  env: {
    // 你的环境变量（包含多个预定义的全局变量）
    //
    // browser: true,
    // node: true,
    // mocha: true,
    // jest: true,
    // jquery: true
  },
  globals: {
    // 你的全局变量（设置为 false 表示它不允许被重新赋值）
    //
    // myGlobal: false
    NodeJS: true,
  },
  rules: {
    // 自定义你的规则
    '@typescript-eslint/no-duplicate-enum-values': 0,
    'max-nested-callbacks': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
