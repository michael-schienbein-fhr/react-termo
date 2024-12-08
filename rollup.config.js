import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/jerminal.min.js',
            name: 'jerminal',
            format: 'umd',
            sourcemap: true,
            plugins: [terser()],
        },
        {
            file: 'dist/jerminal.cjs.js',
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: 'dist/jerminal.esm.js',
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
