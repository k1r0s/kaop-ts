import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
const pkg = require('./package.json')

export default {
  input: `compiled/src/kaop-ts.js`,
  output: [
		{ file: pkg.main, name: 'kaopTs', format: 'umd' },
		{ file: pkg.module, format: 'es' }
  ],
  sourcemap: true,
  plugins: [
    commonjs(),
    resolve()
  ]
}
