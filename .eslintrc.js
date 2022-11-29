const alias = require('./build/alias')();

module.exports = {
  root: true,
  extends: ['plugin:vue/recommended', 'airbnb-base'],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 6,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
  },
  env: {
    browser: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.json', '.jsx', '.ts', '.tsx', 'vue'],
      },
      webpack: {
        config: {
          resolve: {
            alias,
          },
        },
      },
    },
  },
  rules: {
    'comma-dangle': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
      },
    ],
    indent: 'off',
    'vue/script-indent': [
      'error',
      2,
      {
        baseIndent: 1,
        switchCase: 1,
      },
    ],
    'vue/max-attributes-per-line': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    quotes: ['error', 'single'],
    'quote-props': 'off',
    // 'vue/html-quotes': 'off', //关闭html属性双引号验证
    'vue/html-self-closing': 'off', // 关闭html标签空内容验证
    'no-unused-vars': 'warn', // 警告已定义未使用变量验证
    eqeqeq: 'off', // 不需要强制使用全等
    'spaced-comment': 'warn', // 要求或禁止在注释前有空白
    'prefer-destructuring': ['error', { object: true, array: false }], // 对象优先使用结构赋值，数组不强制使用
    'no-underscore-dangle': 'off', // 允许变量名称中带有下划线
    'object-curly-newline': 'off', // 花括号内换行
    'operator-linebreak': ['warn', 'after'], // 换行时操作符在句末
    // 关闭箭头函数的圆括号验证
    'arrow-parens': 'off',
    // 关闭换行符验证
    'linebreak-style': ['off', 'windows'],
    // 函数内可以修改对象属性
    'no-param-reassign': ['error', { props: false }],
    'vue/script-indent': 'off', // 缩进
    'vue/html-closing-bracket-newline': 'off', // vue html标签闭合前换行
    'func-names': 'off', // 声明匿名函数
    'import/prefer-default-export': 'warn', // 设备默认导出
    'space-before-function-paren': 'off', // 函数括号前空格
    radix: 'off', // parseInt()函数,基数判断
    'object-shorthand': 'warn', // 使用箭头函数
    'no-mixed-operators': 'warn', // 禁止混合使用不同的操作符
    'import/no-unresolved': 'off',
  },
};
