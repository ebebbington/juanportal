const path = require('path')

module.exports = {
    entry: {
        profile: './components/Profile/Profile.tsx',
        registerForm: './components/RegisterForm/RegisterForm.tsx',
        header: './components/header/header.tsx'
    },
    devtool: 'inline-source-map',
    output: {
        filename: "[name].js",
        path: __dirname + '/public/javascripts/'
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
                   
            },
            // tsx
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        alias: {
            react: path.resolve('./node_modules/react')
        },
        extensions: ['.js', '.jsx', '.css', '.tsx']
    }
}