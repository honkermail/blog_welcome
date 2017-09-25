const webpack = require("webpack");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

const commonCss = new ExtractTextPlugin("./css/blog-common.css");
const baseCss = new ExtractTextPlugin("./css/base.css");
const htmlPlugin = new HtmlWebpackPlugin({
    filename : "index.html", //文件输出的路径
    template : "src/template.html"
});
const cleanWebpack = new CleanWebpackPlugin(
	['dist/*'],　 //匹配删除的文件
	{
		root : __dirname,//根目录
		verbose : true, //开启在控制台输出信息
		dry : false//启用删除文件
	}
);
module.exports = {
    //页面入口文件配置
    //相当于执行这个JS文件可以直接或间接找到项目中用到的所有模块
    entry: {
        app : './src/index.js'
    },
    //入口文件输出配置
    //最终要打包生成什么名字的文件, 放在哪里
    output: {
        path: __dirname + "/dist",
        filename: 'js/[name]-[hash:8].js'
    },
    module: {
        //模块加载规则配置
        //告诉webpack每一种类型文件(模块)都需要使用什么加载器来处理
        rules: [
			{
				test: /\.css$/, 
				use: commonCss.extract({fallback:"style-loader",use:"css-loader?minimize=true"})
			},{ //图片大于20KB的交给file-loader处理, 以 文件名-8位hash.扩展名 命名
				test: /\.(png|jpe?g|gif|ico)$/, 
				use: [{
					loader : "url-loader" ,
					options : { limit:20000,name:"[name]-[hash:8].[ext]",publicPath:"../",outputPath:"images/" }
				}]
			},{ 
				test: /\.scss$/, 
				use : baseCss.extract({fallback:"style-loader",use:["css-loader","postcss-loader","sass-loader?outputStyle=compressed"]}) 
			},{ 
				test: /\.(svg|eot|ttf|woff2?|otf)$/, 
				use:[{
					loader: "file-loader",
					options :{name:"[name]-[hash:8].[ext]", publicPath:"../", outputPath:"fonts/"}
				}]
			}
        ]
	},
	externals: {
		jquery: 'window.$'
	},
	plugins : [
		//压缩打包之后的js
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
	  
		//将打包后的css单独写入文件, 而不是嵌入js代码当中
		commonCss,
		baseCss,
		htmlPlugin,
		cleanWebpack
	]
};