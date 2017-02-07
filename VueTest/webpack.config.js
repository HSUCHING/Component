var webpack = require('webpack');
// var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

module.exports = {
	//页面入口文件配置
	entry: {
		entry1 : './src/js/index.js',
		entry2 : './src/js/main.js'
	},
	//入口文件输出配置
	output: {
		path: 'dist/js/page',
		filename: '[name].entry.js'
	},
	module: {
		//加载器配置
		loaders: [
			{ test: /\.css$/, loader: 'style-loader!css-loader' },
			{ test: /\.js$/, loader: 'jsx-loader?harmony' },
			{ test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
			{ test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
		]
	},
	//插件项
	plugins: [new webpack.optimize.CommonsChunkPlugin({
		name: 'common',
		filename: 'common.js',
		minChunks: Infinity
	})]
};