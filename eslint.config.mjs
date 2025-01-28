import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node, // Includes Node.js globals like `process`
      },
    },
  },
  {
    languageOptions: {
      globals: globals.browser, // For browser-specific files
    },
  },
  pluginJs.configs.recommended,
];
