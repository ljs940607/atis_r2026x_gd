import antfu from '@antfu/eslint-config'

export default antfu({
  vue: {
    // https://eslint.vuejs.org/rules/
    overrides: {
      'vue/max-attributes-per-line': ['error', {
        singleline: {
          max: 1,
        },
        multiline: {
          max: 1,
        },
      }],
      'vue/attributes-order': ['error', {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          ['UNIQUE', 'SLOT'],
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT',
        ],
        alphabetical: true,
      }],
      'vue/block-order': ['error', {
        order: ['script', 'template', 'style', 'route'],
      }],
    },
  },
  stylistic: {
    overrides: {
      'import/order': ['error', {
        'alphabetize': { order: 'asc', orderImportKind: 'asc' },
        'newlines-between': 'always',
        'pathGroups': ['composables', 'config', 'directives', 'interfaces', 'services', 'stores', 'utils'].map(el => ({
          pattern: `~/${el}/**`,
          group: 'internal',
          position: 'after',
        })),
        'distinctGroup': true,
      }],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'func-call-spacing': ['error', 'never'],
      'function-paren-newline': ['error', 'multiline-arguments'],
      'max-len': ['warn', { code: 120, ignoreUrls: true, ignoreTemplateLiterals: true, ignoreComments: true }],
      'newline-per-chained-call': ['error', { ignoreChainWithDepth: 1 }],
    },
  },
  javascript: {
    overrides: {
      'complexity': ['error', 10],
      'max-params': ['error', 4],
      'max-statements': ['error', 15],
      'max-nested-callbacks': ['error', 2],
      'max-depth': ['error', { max: 3 }],
      'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }],
      'no-warning-comments': 'warn',
    },
  },
}, [{
  files: ['test/**/*'],
  rules: {
    'max-len': 'off',
    'max-statements': 'off',
    'max-depth': 'off',
  },
}, {
  files: ['test/**/*.json'],
  rules: {
    'max-lines': 'off',
  },
}])
