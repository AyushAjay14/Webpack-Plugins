const WebpackCompressionPlugin = require('compression-webpack-plugin');
module.exports = ()=>({
    plugins: [new WebpackCompressionPlugin()]
})