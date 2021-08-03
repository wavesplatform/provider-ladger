const path = require('path');
const resolve = path.resolve;

module.exports = [
    {
        entry: './src_provider/index.ts',
        mode: "production",
        module: {
            rules: [
                {
                    test: /\.ts/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.less$/,
                    use: [
                        // conf.mode === 'production' ? MiniCssExtractPlugin.loader : 
                        { loader: "style-loader" },
                        {
                            loader: "css-loader",
                            options: {
                                modules: true,
                                localIdentName: '[folder]__[local]--[hash:base64:5]',
                            }
                        },
                        {
                            loader: "less-loader",
                            options: { root: path.resolve(__dirname, './') }
                        },
                    ]
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
        },
        output: {
            libraryTarget: 'umd',
            globalObject: 'this',
            library: 'providerLedger',
            filename: 'provider-ledger.js',
            path: resolve(__dirname, 'dist'),
        }
    }
];
