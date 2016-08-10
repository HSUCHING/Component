/**
 * Created by chinghsu on 16/8/9.
 */
//http://localhost:8080/webpack-dev-server/dist/html/index.html
var webpack = require('webpack');
var path=require('path');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
module.exports = {
    plugins: [commonsPlugin],
    // (1) Method
    // entry:{
    //     index:'./src/js'
    //     index:'./src/js/index.js'
    // },
    // (2) Method
    entry:[
        path.resolve(__dirname,'src/js')
    ],
    devtool: 'eval-source-map',
    // entry: [
    //     // 'webpack-dev-server/client?http://0.0.0.0:8080',
    //     // 'webpack/hot/only-dev-server',
    //     // path.resolve(__dirname,'src/js/index.js')
    //     {index: './src/js/index.js'}
    // ],
    output: {
        publicPath: "http://0.0.0.0:8080/dist/js",
        path: path.resolve(__dirname,'dist/js'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style!css'},
            {test: /\.js|jsx$/, loaders: ['babel']},
            {test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
            {test: /\.less$/, loader: "style!css!less"},
            {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    //其它解决方案配置
    // resolve: {
    //     root: '/github/flux-example/src', //绝对路径
    //     extensions: ['', '.js', '.json', '.scss'],
    //     alias: {
    //         AppStore: 'js/stores/AppStores.js',
    //         ActionType: 'js/actions/ActionType.js',
    //         AppAction: 'js/actions/AppAction.js'
    //     }
    // }
};
