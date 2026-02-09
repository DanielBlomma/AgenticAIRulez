// ESLint configuration for React frontend in Python FastAPI projects
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'react-hooks',
  ],
  rules: {
    // Code quality
    'max-lines-per-function': ['error', { max: 150 }],
    'max-depth': ['error', 3],
    'complexity': ['error', 10],
    
    // React specific
    'react/react-in-jsx-scope': 'off', // React 17+
    'react/prop-types': 'off', // Using TypeScript
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // TypeScript
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    
    // General
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};