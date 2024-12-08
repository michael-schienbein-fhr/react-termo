import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

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
        postcss({
            extract: 'xterm.css', // Extracts CSS to a separate file
            minimize: true, // Minifies CSS
        }),
        typescript({
            tsconfig: './tsconfig.json',
            clean: true,
        }),
    ],
};
