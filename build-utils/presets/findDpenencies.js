/* This plugin returns the list of modules that are dependent on the function that is given to it as an argument using the option object

How to call it in webpack.config.js file
    plugins: [
        new FunctionDependencyPlugin({
        // array of name of functions for which we need to find dependencies
        functions: ['func'],
        // outputPath for the final result 
        outputPath: './function-dependencies.json',
        }),
    ],
*/

// Import required modules
const fs = require('fs');
const path = require('path');''

let PluginTitle = 'FunctionDependencyPlugin';
class FunctionDependencyPlugin {
    // constructor that take options object as argument
  constructor(options) {
    this.functions = options.functions;
    this.outputPath = options.outputPath || './function-dependencies.json';
  }

  apply(compiler) {
    // Hook into the compilation
    compiler.hooks.compilation.tap(PluginTitle, (compilation) => {
        // hook that is triggered when all modules have been processed
      compilation.hooks.finishModules.tap(PluginTitle, (modules) => {
        // object to store the dependencies of functions
        const functionDependencies = {};
        // {key:{set of dependencies of key function}} -> structure of object 
        for (const currentFunction of this.functions) {
          functionDependencies[currentFunction] = new Set();
        }
        for (const module of modules) {
          for (const currentFunction of this.functions) {
            // finding the modules that are dependency on current function
            const dependentModules = this.findDependencies(compilation, module, currentFunction);
            // iterating dependent module array
            for (const dependentModule of dependentModules) {
                // adding the dependent modules to function'set in functionDependencies object
              functionDependencies[currentFunction].add(dependentModule.resource);
            }
          }
        }
        // object that stores the final output in which the sets are converted to arrays for easy access
        const finalOutput = {};
        // same keys but not {key:set} converted to {key:array}
        for (const currentFunction in functionDependencies) {
            finalOutput[currentFunction] = Array.from(functionDependencies[currentFunction]);
        }
        // JSON.stringify(finalOutput, null, 2) -> (object, Json string transformation, number of spaces) , converts the finalOutput object to JSON format
        fs.writeFileSync(this.outputPath, JSON.stringify(finalOutput, null, 2));
      });
    });
  }
  findFunctions(compilation , module , requiredFunction){

  }
  //function that is used to find the dependent modules for any requiredFunction
  findDependencies(compilation, module, requiredFunction, visited = new Set()) {
    // checks if the module has already been visited
    if (visited.has(module)) {
      return [];
    }
    // added the module to visited array
    visited.add(module);
    // array that stores all the modules that are dependent on the requiredFunction
    const dependentModules = [];
    // iterating module.dependencies 
    for (const dependency of module.dependencies) {
      /* if our dependency belongs to either of these subclasses then that means our dependency is import dependency which is exatly what we need for our project */
      if (dependency instanceof require('webpack/lib/dependencies/HarmonyImportSpecifierDependency') ||dependency instanceof require('webpack/lib/dependencies/ImportDependency')) {

        // last element of the array because it is the same function that was initially exported from its source file
        const importedFunctionId = dependency.ids.at(-1);
        console.log(dependency);
        // If the imported function name matches the target function, add the module to the dependent modules array
        if (importedFunctionId && importedFunctionId === requiredFunction) {
          console.log(module);
          dependentModules.push(module);
        } else {
            // recursively searching the dependency's module for finding modules dependent on the requiredFunction
            // compilation.moduleGraph.getModule(dependency) gives the module related to dependency 
          const childrenDependencyModules = this.findDependencies(compilation, compilation.moduleGraph.getModule(dependency), requiredFunction, visited);
          // adding the child dependent modules to the dependentModules array
          dependentModules.push(...childrenDependencyModules);
        }
      }
    }
    // return the dependentModules array
    return dependentModules;
  }
}

// Export the FunctionDependencyPlugin class
module.exports = FunctionDependencyPlugin;