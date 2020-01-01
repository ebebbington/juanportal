const path = require('path')

module.exports = {
    entry: './components/test.jsx',
    output: {
        filename: 'test.js',
        path: path.resolve(__dirname, 'public/javascripts/components')
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                //loader: 'babel-loader',
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
}