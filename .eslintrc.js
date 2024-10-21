module.exports = {
  'env': {
    node: true,
    commonjs: true,
    es2021: true
  },
  'extends': 'standard',
  'overrides': [
  ],
  'parserOptions': {
    ecmaVersion: 'latest'
  },
  'rules': {
    'camelcase': 'off',
    'semi': ['error', 'always'],
    'semi-spacing': ['error', {
      'before': false,
      'after': true
    }],
    'semi-style': ['error', 'last'],
    'no-extra-semi': 'error',
    'comma-dangle': ['warn', 'never'],
    'quote-props': ['error', 'consistent', {
      'keywords': true,
      'numbers': false
    }],
    'quotes': ['error', 'single', {
      'avoidEscape': true,
      'allowTemplateLiterals': true
    }],
    'strict': ['error', 'never']

  }
};
