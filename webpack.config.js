const rootPath = __dirname;

const
    webpack = require('webpack'),
    UglifyJsPlugin = webpack.optimize.UglifyJsPlugin,
    CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin,
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * ExtractTextPlugin的使用
 * 1.将module.loaders中的css配置的loader的值'style!css!sass'改造为，类似ExtractTextPlugin.extract('style', 'css!sass?sourceMap')}的值。
 * 2.在plugins中加入插件ExtractTextPlugin。
 * 这样的话，每个html内嵌的js中的css会被踢出js，在html中生成link标签(会和HtmlWebpackPlugin配合使用比较方便)。
 *
 * CommonsChunkPlugin的使用(如果想踢出一些公共的js和css)
 * 1.在plugins中加入插件CommonsChunkPlugin。
 * 2.CommonsChunkPlugin参数中的name必须和entry的某一个key对应，如temp/common。
 * 3.在HtmlWebpackPlugin中的chunks里面加入第二个步骤里面中entry的key，如temp/common(顺序不重要，webpack会把vendor自动处理到最前面)。
 *
 */

//webpack配置
module.exports = {
    //入口文件路径配置
    entry: {
        index1: `${rootPath}/src/scripts/index1.js`,
        index2: `${rootPath}/src/scripts/index2.js`,
        'temp/common': [`${rootPath}/src/lib/utils1.js`]
    },
    //输出文件路径配置
    output: {
        path: `${rootPath}/assets/`,
        publicPath: '/assets/',
        filename: '[name].js'
    },
    //模块加载器配置
    module: {
        loaders: [
            //script加载器
            {test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel'},
            //image加载器
            {test: /\.(png|jp[e]?g|gif)$/, loader: 'url?limit=10240&name=images/[name].[hash:5].[ext]'},
            //font加载器
            {test: /\.(woff|svg|eot|ttf)$/, loader: 'url?limit=10240&name=fonts/[name].[hash:5].[ext]'},
            //css加载器
            {test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css')},
            //sass加载器
            {test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!sass?sourceMap')}
        ]
    },
    //插件配置
    plugins: [
        //压缩js
        new UglifyJsPlugin({
            compress: {
                warnings: false
            },
            except: ['$super', '$', 'exports', 'require']
        }),
        //抽取css
        new ExtractTextPlugin('[name].css'),
        //提取公共js文件
        new CommonsChunkPlugin({
            name: 'temp/common',
            minChunks: Infinity
        }),
        //编译html
        new HtmlWebpackPlugin({
            filename: `${rootPath}/assets/index1.html`,
            template: `${rootPath}/src/views/index1.html`,
            hash: true,
            chunks: ['temp/common', 'index1']
        }),
        new HtmlWebpackPlugin({
            filename: `${rootPath}/assets/index2.html`,
            template: `${rootPath}/src/views/index2.html`,
            hash: true,
            chunks: ['index2', 'temp/common']
        })
    ]
};