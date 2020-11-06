module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ],
    settings: {
        react: {
            version: 'detect',
        },
    },
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    plugins: ['@typescript-eslint', 'react', 'prettier'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        'react/prop-types': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'prettier/prettier': 'error',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
            },
        ],
    },
    overrides: [
        // Override some TypeScript rules just for .js files
        {
            files: ['*.js'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
            },
        },
    ],
};
