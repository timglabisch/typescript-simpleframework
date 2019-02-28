const path = require('path');

module.exports = {
    entry: './src/index.ts',
    watchOptions: {
        aggregateTimeout: 300,
        ignored: /node_modules/,
        poll: 300
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};