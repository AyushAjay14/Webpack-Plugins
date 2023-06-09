const HtmlWebpackPlugin = require("html-webpack-plugin");
// const PresetConfig = require('./build-utils/loadPresets');
// const ModeConfig = (env) => require(`./build-utils/webpack.${env}`)(env);
const astPlugin = require("./build-utils/presets/astPlugin")
const {merge} = require('webpack-merge');
const deadcodePlugin = require("./build-utils/presets/deadCodePlugin");
const watchChangePlugin = require('./build-utils/presets/watchChangesPlugin');
const findDependencies = require('./build-utils/presets/findDpenencies');
const WebpackDeadcode = require("webpack-deadcode-plugin")
const funcTofuncPlugin = require("./build-utils/presets/funcTofuncPlugin");
const CircularDependencyPlugin = require('./build-utils/presets/circularDependencyPlugin');
module.exports = ({mode , presets}= {mode: "none" , presets:[]})=>{
  return merge(
    {
      mode,
      devServer: {
          allowedHosts: 'all',
        },
        entry: {
          bundle : './parsed/BabelTraverse.js'
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
      }})  , new astPlugin() , new HtmlWebpackPlugin() ]
  },
  // ModeConfig(mode),
  // PresetConfig({mode , presets})
  )
}