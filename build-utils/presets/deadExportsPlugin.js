class UnusedExportsPlugin {
    apply(compiler) {
      compiler.hooks.compilation.tap("UnusedExportsPlugin", (compilation) => {
        compilation.hooks.afterOptimizeDependencies.tap("UnusedExportsPlugin", (modules) => {
          for (const module of modules) {
            console.log(module.providedExports);
            const unusedExports = module.buildMeta && module.buildMeta.providedExports
              ? module.buildMeta.providedExports.filter((exportName) => !module.usedExports.has(exportName))
              : [];
  
            if (unusedExports.length > 0) {
              console.warn(`Unused exports in module: ${module.resource}`);
              console.warn("Unused exports:", unusedExports);
            }
          }
        });
      });
    }
  }
  
  module.exports = UnusedExportsPlugin;
  