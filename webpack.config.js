const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: ['@babel/polyfill', './src/index.js'],
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'script.js',
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: { minimize: false },
                    },
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: { presets: ['@babel/preset-env'] },
                },
            },
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                loader: 'file-loader',
                options: {
                    outputPath: 'assets/fonts',
                    name: '[name].[ext]',
                },
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/images/[name].[ext]',
                            esModule: false,
                        },
                    },
                ],
            },

            {
                test: /\.css$/,
                use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader'],
            },
            {
                test: /\.(ogg|mp3|wav|mpe?g)$/i,
                loader: 'file-loader',
                options: { name: '[path][name].[ext]' },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html',
        }),
        new MiniCssExtractPlugin({ filename: 'style.css' }),

        new CopyWebpackPlugin([{ from: 'src/assets/images', to: 'assets/images' }]),
    ],
    devServer: { open: true },
};
