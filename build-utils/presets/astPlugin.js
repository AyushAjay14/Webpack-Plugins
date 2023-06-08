const babel = require('@babel/core');
// const babelPlugin = require('./babelPlugin')
class astPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
            compilation.hooks.finishModules.tap("Myplugin" , (modules) =>{
                for(let module of modules ){
                    // console.log(module._source._value);
                    // babelPlugin.getAST(module._source._value);
                }
            })
        });
    }
}

module.exports = astPlugin;