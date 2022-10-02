module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  parserOptions: { project: './tsconfig.eslint.json', tsconfigRootDir: __dirname },
  rules: {
    'max-len': ['error', { code: 120 }],
    '@typescript-eslint/no-use-before-define': 'off',
  },
};
