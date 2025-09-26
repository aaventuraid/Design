const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      '.next/**/*',
      'node_modules/**/*',
      'dist/**/*',
      '*.config.js',
      'next-env.d.ts'
    ]
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react-hooks/exhaustive-deps': 'off',
      '@next/next/no-img-element': 'off',
      'prefer-const': 'warn',
      'no-var': 'error',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/triple-slash-reference': 'off'
    }
  }
];