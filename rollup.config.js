import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/termo.min.js',
            name: 'termo',
            format: 'umd',
            sourcemap: true,
            plugins: [terser()],
        },
        {
            file: 'dist/termo.cjs.js',
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: 'dist/termo.esm.js',
            format: 'es',
            sourcemap: true,
        },
    ],
    external: [],
    plugins: [
        resolve({
            browser: true,
            preferBuiltins: false,
        }),
        commonjs(),

        typescript({
            tsconfig: './tsconfig.json',
            clean: true,
        }),
        json(),
    ],
};
