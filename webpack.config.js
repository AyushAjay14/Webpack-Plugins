const HtmlWebpackPlugin = require("html-webpack-plugin");
const PresetConfig = require('./build-utils/loadPresets');
const path = require('path');
const ModeConfig = (env) => require(`./build-utils/webpack.${env}`)(env);
const {merge} = require('webpack-merge');
const webpackPlugin = require("./build-utils/presets/webpackPlugin");
const NormalModuleReplacementPlugin = require('./build-utils/presets/NormalmoduleReplacementPlugin')
const CircularDependencyPlugin = require('./build-utils/presets/circularDependencyPlugin');
module.exports = ({mode , presets}= {mode: "none" , presets:[]})=>{
  return merge(
    {
      mode,
      devServer: {
          allowedHosts: 'all',
        },
        entry: {
          a : './src/a.js'
        },
      output: {
          filename: "[name].js"
      },
      module: {
          rules: [
              {
                  test: /\.?js$/,
                  exclude: /node_modules/,
                  use: {
                    loader: "babel-loader",
                    options: {
                      presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                  }
                },
                {
                  test: /\.css$/,
                  use: ["style-loader" , "css-loader"]
                }
          ]
        },
      plugins: [new CircularDependencyPlugin({ exclude: /a\.js|node_modules/, onStart({compilation}){
        // fs.writeFile('compilation.txt' , compilation , (err)=> console.log(err));
        // console.log("compilation has started: " , compilation);
      }}) ,new HtmlWebpackPlugin() , new webpackPlugin() , new NormalModuleReplacementPlugin(/\.js$/ , (resource)=>{
        // console.log(resource.request);
      })]
  },
  // ModeConfig(mode),
  // PresetConfig({mode , presets})
  )
}