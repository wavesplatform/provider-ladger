const { resolve } = require('path');

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
