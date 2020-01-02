const path = require('path')

module.exports = {
    entry: {
        test: './components/test.jsx',
        button: './components/button.jsx',
    },
    output: {

        path: __dirname + '/public/javascripts/components'
    },
    module: {
        rules: [
            // jsx
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            },
            // css
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            // This caused some cofusion. If you wish to use modules e.g. className={mystylehseet.button} then set this to true, which also jumbles up the class name in the browser
                            // which i assume helps with CSS Confusion. You can also set it to false (or comment out) to specifically set the classnames e.g. classname="button"
                            modules: true 
                        }
                    }
                ]
                //or
                // loader: 'css-loader',
                // options: {
                //     minimize: true,
                //     modules: true,
                //     localIdentName:'[name]__[local]__[hash:base64:5]',
                // }
                //or
                // query: {
                //     importLoaders: 1,
                //     modules: true,
                //     //localIdentName:'[name]__[local]__[hash:base64:5]',
                // } 
                   
            }
        ]
    },
    resolve: {
        alias: {
            react: path.resolve('./node_modules/react')
        },
        extensions: ['*', '.js', '.jsx', '.css']
    }
}