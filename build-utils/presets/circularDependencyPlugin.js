let path = require('path')
let extend = require('util')._extend
let BASE_ERROR = 'Circular dependency detected:\r\n'
let PluginTitle = 'CircularDependencyPlugin'
const fs = require('fs');
class CircularDependencyPlugin {
  constructor(options) {
    // Ayush - extend keyword takes two arguements and first object inherites the property of second object ;
    this.options = extend({
      exclude: new RegExp('$^'),
      include: new RegExp('.*'),
      failOnError: false,
      allowAsyncCycles: false,
      onDetected: false,
      cwd: process.cwd()
    }, options)
  }

  apply(compiler) {
    let plugin = this
    let cwd = this.options.cwd
    compiler.hooks.compilation.tap(PluginTitle, (compilation) => {
      compilation.hooks.optimizeModules.tap(PluginTitle, (modules) => {
        if (plugin.options.onStart) {
            // Ayush- if user specifies onStart then it sends the compilation object 
          plugin.options.onStart({ compilation });
        }
        for (let module of modules) {
            // console.log(module.resource , '\n');
            // console.log(module.resource , ':' , module.dependencies);
            // fs.writeFileSync('moduleresource.txt' , module.resource+ '\n' , (err)=> console.log(err))
          const shouldSkip = (
            module.resource == null ||
            plugin.options.exclude.test(module.resource) ||
            !plugin.options.include.test(module.resource)
          )
          // skip the module if it matches the exclude pattern
          if (shouldSkip) {
            continue
          }

          let maybeCyclicalPathsList = this.isCyclic(module, module, {}, compilation)
          if (maybeCyclicalPathsList) {
            // allow consumers to override all behavior with onDetected
            if (plugin.options.onDetected) {
              try {
                plugin.options.onDetected({
                  module: module,
                  paths: maybeCyclicalPathsList,
                  compilation: compilation
                })
              } catch(err) {
                compilation.errors.push(err)
              }
              continue
            }

            // mark warnings or errors on webpack compilation
            let error = new Error(BASE_ERROR.concat(maybeCyclicalPathsList.join(' -> ')))
            if (plugin.options.failOnError) {
              compilation.errors.push(error)
            } else {
              compilation.warnings.push(error)
            }
          }
        }
        if (plugin.options.onEnd) {
          plugin.options.onEnd({ compilation });
        }
      })
    })
  }

  isCyclic(initialModule, currentModule, seenModules, compilation) {
    let cwd = this.options.cwd

    // Add the current module to the seen modules cache
    seenModules[currentModule.debugId] = true

    // If the modules aren't associated to resources
    // it's not possible to display how they are cyclical
    if (!currentModule.resource || !initialModule.resource) {
      return false
    }

    // Iterate over the current modules dependencies
    for (let dependency of currentModule.dependencies) {
        // console.log(dependency);
        // console.log(currentModule.resource , ': ' , dependency);
        // console.log(currentModule.resource , ':', dependency.constructor.name ,':' , dependency.request);
      if (
        dependency.constructor &&
        dependency.constructor.name === 'CommonJsSelfReferenceDependency'
      ) {
        continue
      }
      let depModule = null
      if (compilation.moduleGraph) {
        // handle getting a module for webpack 5
        // console.log(compilation.moduleGraph);
        depModule = compilation.moduleGraph.getModule(dependency)
        // console.log(currentModule.resource , ': ' ,dependency.resource)
      } else {
        // handle getting a module for webpack 4
        depModule = dependency.module
      }

      if (!depModule) { continue }
      // ignore dependencies that don't have an associated resource
      if (!depModule.resource) { continue }
      // ignore dependencies that are resolved asynchronously
      if (this.options.allowAsyncCycles && dependency.weak) { continue }
      // the dependency was resolved to the current module due to how webpack internals
      // setup dependencies like CommonJsSelfReferenceDependency and ModuleDecoratorDependency
      if (currentModule === depModule) {
        continue
      }

      if (depModule.debugId in seenModules) {
        if (depModule.debugId === initialModule.debugId) {
          // Initial module has a circular dependency
          return [
            path.relative(cwd, currentModule.resource),
            path.relative(cwd, depModule.resource)
          ]
        }
        // Found a cycle, but not for this module
        continue
      }

      let maybeCyclicalPathsList = this.isCyclic(initialModule, depModule, seenModules, compilation)
      if (maybeCyclicalPathsList) {
        maybeCyclicalPathsList.unshift(path.relative(cwd, currentModule.resource))
        return maybeCyclicalPathsList
      }
    }

    return false
  }
}

module.exports = CircularDependencyPlugin