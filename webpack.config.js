const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ImageminPlugin = require("imagemin-webpack");

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;
const optimization = () => {
    const configObj = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        configObj.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin(),
        ]
    }
}

const plugins = () => {
    const basePlugins = [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            filename: "index.html",
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `./css/${filename('css')}`
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/assets'),
                    to: path.resolve(__dirname, 'app/assets')
                }
            ]
        }),
    ];

    // if (isProd) {
    //     basePlugins.push(
    //         new ImageminPlugin({
    //             bail: false,
    //             cache: true,
    //             imageminOptions: {
    //                 plugins: [
    //                     ["gifsicle", { interlaced: true }],
    //                     ["jpegtran", { progressive: true }],
    //                     ["optipng", { optimizationLevel: 5 }],
    //                     [
    //                         "svgo",
    //                         {
    //                             plugins: [
    //                                 {
    //                                     removeViewBox: false
    //                                 }
    //                             ]
    //                         }
    //                     ]
    //                 ]
    //             }
    //         })
    //     )
    // }

    return basePlugins
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: './main.js',
    output: {
        filename: `./js/${filename('js')}`,
        path: path.resolve(__dirname, 'app'),
        publicPath: ""
    },
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, 'app'),
        open: true,
        compress: true,
        hot: true,
        port: 3000
    },
    plugins: plugins(),
    optimization: optimization(),
    devtool: isProd ? false : "source-map",
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: "html-loader",
                options: {
                    sources: false
                }
            },
            {
                test:  /\.js$/,
                exclude: '/node_modules/',
                use: ['babel-loader']
            },
            {
                test:  /\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                        }
                    },
                    'css-loader'
                ]
            },
            {
                test:  /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: (resourcePath, context) => {
                                return path.relative(path.dirname(resourcePath), context) + "/";
                            },
                        }
                    },
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test:  /\.(?:|gif|png|jpe?g|webp)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: `./assets/img/${filename('[ext]')}`
                        }
                    }
                ]
            },
            {
                test:  /\.(?:|svg|ico)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: `./assets/ico/${filename('[ext]')}`
                        }
                    }
                ]
            },
            {
                test:  /\.(?:|woff2|woff)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: `./assets/fonts/${filename('[ext]')}`
                        }
                    }
                ]
            }
        ]
    }
}