const webpack = require('webpack');
const config = {
    mode: 'development',
    entry: {
        map: './js/map.jsx'
    },
    devtool: 'inline-source-map',
    output: {
        path: __dirname + '/dist/bundle',
        filename: '[name].bundle.js',
    },
    resolve:{
        extensions:[
            '.js',
            '.jsx',
            '.css'
        ]
    },
    module:{
        rules:[
            {
                test:/\.jsx?/,
                exclude:/node_modules/,
                use:'babel-loader'
            },
            {
                test:/\.(jpe?g|png|gif|svg)$/i,
                // this was giving me the error `Compiling RuleSet failed: Query arguments on 'loader' has been removed in favor of the 'options' property (at ruleSet[1].rules[1].loader: file-loader?name=/public/[name].[ext])` and I didn't know how to fix it
                // loader:"file-loader?name=/public/[name].[ext]",
                loader:"file-loader"
            },
            {
                test: /\.css$/,
                use:[
                    'style-loader',
                    'css-loader'
                ],

            },

        ]
    }
};


module.exports = config;