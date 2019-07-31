const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => ({
    entry: {
        app: "./src/js/app.js",
        ats: "./src/js/ats.js",
        meeting: "./src/js/meeting.js",
        settings: "./src/js/settings.js",
        team: "./src/js/view-team.js"
    },
    output: {
        path: path.resolve(__dirname, "app/assets/"),
        filename: "[name].js"
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                query: {
                    presets: ["@babel/env"]
                }
            },
            {
                test: /\.[s]?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader", // translates CSS into CommonJS
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true,
                            config: { path: "src/" }
                        }
                    },
                    {
                        loader: "sass-loader", // compiles Sass to CSS
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "fonts/"
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: ["file-loader"]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, "public"),
                to: path.resolve(__dirname, "app/assets")
            }
        ]),
        new MiniCssExtractPlugin({
            path: path.resolve(__dirname, "app/assets"),
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ]
});
