import { babel } from '@rollup/plugin-babel'
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import json from "@rollup/plugin-json"
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import terser from '@rollup/plugin-terser'

export default [
	{
		input: "./index.ts",
		output: [
			{
				file: "../cif.js",
				format: "cjs",
				// sourcemap: true,
			},
		],
		plugins: [
			peerDepsExternal(),
			resolve(),
			commonjs(),
			typescript( { tsconfig: "./tsconfig.json" } ),
			json(),
			babel( { babelHelpers: 'bundled', presets: [ '@babel/preset-env' ] } ),
			// terser({ "mangle": { reserved: ['$'] } }),
		],
	}
]
