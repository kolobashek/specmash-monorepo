import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'

export default [
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.es2021,
				...globals.node,
			},
			parser: tseslint.parser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		plugins: {
			'@typescript-eslint': tseslint.plugin,
			react: pluginReact,
		},
		rules: {
			indent: ['error', 2, { SwitchCase: 1 }],
			'linebreak-style': ['error', 'unix'],
			quotes: ['error', 'single'],
			semi: ['error', 'never'],
			'@typescript-eslint/no-explicit-any': 'warn',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
			'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
			'@typescript-eslint/no-unused-expressions': [
				'error',
				{
					allowShortCircuit: true,
					allowTernary: true,
				},
			],
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginReact.configs.recommended,
]
