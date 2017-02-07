/**
 * Created by chinghsu on 17/2/4.
 */
var webpack = require('webpack');
// var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
module.exports = {
	entry: {
		entry1: './src/entry1.js',
		entry2: './src/entry2.js'
	},
	output: {
		path: "dist/js",
		filename: '[name].entry.js'
	},
	module: {
		loaders: [{
			test: /\.js$/,
			loader: 'babel-loader'
		}, {
			test: /\.jsx$/,
			loader: 'babel-loader!jsx-loader?harmony'
		}]
	},
	plugins: [
	new webpack.optimize.CommonsChunkPlugin({
		name: 'inline',
		filename: 'inline.js',
		minChunks: Infinity
	})]
};