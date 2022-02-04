module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [
    '@nuxtjs',
    'plugin:import/recommended',
    'plugin:nuxt/recommended'
  ],
  plugins: [
    'import'
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['~/*', './'],
          ['@/*', './']
        ],
        extensions: ['.js', '.mjs', '.vue']
      },
      node: {
        extensions: ['.js', '.mjs', '.vue']
      }
    }
  },
  rules: {
    'import/no-unresolved': [2, { }]
  },
  overrides: [
    {
      files: ['layouts/default.vue'],
      rules: {
        'vue/multi-word-component-names': 'off'
      }
    }
  ]
}
