const fs = require("fs");
const path = require('path');
class PrintChunksPlugin{
    apply(compiler){
        compiler.hooks.compilation.tap("MyFirstPlugin" , (compilation)=>{
            compilation.hooks.finishModules.tap("PrintChunkss" , (modules)=>{
                const {_moduleMap : moduleMap } = compilation.moduleGraph;
                let module;
                  module = Array.from(moduleMap)[0][0];
                  const func = () =>{
                    // console.log(module.resource);
                    const corrGraphModule = moduleMap.get(module);
                    // console.log(corrGraphModule.incomingConnections.size);
                    if(corrGraphModule.incomingConnections.size === 0 ) {
                      // console.log(corrGraphModule);
                      return ;
                    }
                    const [parent] = corrGraphModule.incomingConnections;
                    // console.log(parent.module.resource);
                    func(parent.module);
                  }
                  // func(module);
                // console.log(compilation.moduleGraph);
                // console.log(compilation.entryDependencies);
                const printSpace = (space) =>{
                    let s = '';
                    for(let i=0;i<space;i++) s += ' ';
                    return s;
                }
                  const dfs = () => {
                    const root = Array.from(moduleMap)[0][0];
                    // console.log(root);
                    const visited = new Map();
          
                    const traverse = (currentNode , space) => {
                      if (visited.get(currentNode)) {
                        return;
                      }
                      visited.set(currentNode, true);
                      
                      console.log(
                        printSpace(space) , path.basename(currentNode?.resource)
                      );
                      const correspondingGraphModule = moduleMap.get(currentNode);
                        // console.log(correspondingGraphModule);
                      const children = new Set(
                        Array.from(
                          correspondingGraphModule?.outgoingConnections || [],
                          (c) => c.module
                        )
                      );
                      for (const c of children) {
                        traverse(c , space+2 );
                      }
                    };
          
                    // Starting the traversal.
                    traverse(root , 0 );
                  };
          
                  dfs();
          
            });
        });
    }
}
module.exports = PrintChunksPlugin;