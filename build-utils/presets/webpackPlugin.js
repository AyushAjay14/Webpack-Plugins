const fs = require("fs");
class PrintChunksPlugin{
    apply(compiler){
        compiler.hooks.compilation.tap("MyFirstPlugin" , (compilation , params)=>{
            // console.log(compilation.hooks);
            compilation.hooks.buildModule.tap("PrintChunkss" , (module)=>{
                
            })
        })
    }
}
module.exports = PrintChunksPlugin;