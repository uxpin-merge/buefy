import vue from 'rollup-plugin-vue'
import replace from 'rollup-plugin-replace'
import node from 'rollup-plugin-node-resolve'
import cjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

import fs from 'fs'
import path from 'path'

import pack from './package.json'

const babelConfig = {
    exclude: 'node_modules/**',
    runtimeHelpers: true,
    babelrc: false,
    presets: [['@babel/preset-env', { useBuiltIns: 'usage' }]],
    plugins: ['@babel/plugin-syntax-dynamic-import']
}

const bannerTxt = `/*! Buefy v${pack.version} | MIT License | github.com/buefy/buefy */`

const baseFolder = './src/'
const componentsFolder = 'components/'

const components = fs.readdirSync(baseFolder + componentsFolder)
    .filter((f) => (fs.statSync(path.join(baseFolder + componentsFolder, f)).isDirectory()))

const mapComponent = (name = '') => {
    const componentFolder = name ? `${name}/` : ''
    return [
        {
            input: baseFolder + componentsFolder + componentFolder + 'index.js',
            external: ['vue'],
            output: {
                format: 'umd',
                name: !name ? 'buefy' : name,
                file: `dist/components/${componentFolder}index.js`,
                banner: bannerTxt,
                exports: 'named',
                globals: {
                    vue: 'Vue'
                }
            },
            plugins: [
                replace({ 'process.env.NODE_ENV': 'production' }),
                node({
                    extensions: ['.vue', '.js']
                }),
                cjs(),
                vue({
                    css: true,
                    compileTemplate: true
                })
            ]
        },
        {
            input: baseFolder + componentsFolder + componentFolder + 'index.js',
            external: ['vue'],
            output: {
                format: 'esm',
                file: `dist/es/components/${componentFolder}index.js`,
                banner: bannerTxt
            },
            plugins: [
                replace({ 'process.env.NODE_ENV': 'production' }),
                node({
                    extensions: ['.vue', '.js']
                }),
                cjs(),
                vue({
                    css: true,
                    compileTemplate: true
                })
            ]
        }
    ]
}

const config = [
    // individual components
    ...components.map((f) => mapComponent(f)).reduce((r, a) => r.concat(a), []),
    // individual components wrapper
    ...mapComponent(),
    {
        input: 'src/index.js',
        external: ['vue'],
        output: {
            format: 'esm',
            file: `dist/es/buefy.js`,
            banner: bannerTxt
        },
        plugins: [
            replace({ 'process.env.NODE_ENV': 'production' }),
            node({
                extensions: ['.vue', '.js']
            }),
            cjs(),
            vue({
                css: true,
                compileTemplate: true
            })
        ]
    },
    {
        input: 'src/index.js',
        external: ['vue'],
        output: {
            format: 'cjs',
            file: 'dist/buefy.cjs.js'
        },
        plugins: [
            replace({ 'process.env.NODE_ENV': 'production' }),
            node({
                extensions: ['.vue', '.js']
            }),
            cjs(),
            vue({
                css: true,
                compileTemplate: true
            }),
            babel(babelConfig)
        ]
    },
    {
        input: 'src/index.js',
        external: ['vue'],
        output: {
            format: 'umd',
            name: 'buefy',
            file: 'dist/buefy.js',
            banner: bannerTxt,
            globals: {
                vue: 'Vue'
            }
        },
        plugins: [
            replace({ 'process.env.NODE_ENV': 'production' }),
            node({
                extensions: ['.vue', '.js']
            }),
            cjs(),
            vue({
                css: true,
                compileTemplate: true
            }),
            babel(babelConfig)
        ]
    }
]

export default () => {
    if (process.env.MINIFY === 'true') {
        config.forEach((c) => {
            c.output.file = c.output.file.replace(/\.js/g, '.min.js')
            c.plugins.push(terser())
        })
    }
    return config
}
