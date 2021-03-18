module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "@typescript-eslint/no-explicit-any": ["off"],    // any警告
    '@typescript-eslint/no-non-null-assertion': 'off', // 非空断言警告
    // "newline-after-var": 1,//变量声明后是否需要空一行"
    "lines-between-class-members": "off",
    'no-multiple-empty-lines': [2, {              // 禁止出现多行空行
      'max': 2
    }],
  }
}
