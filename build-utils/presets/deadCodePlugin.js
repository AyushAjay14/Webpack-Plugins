const exp = require("constants");
const path = require("path");
const fg = require("fast-glob")
class deadcodePlugin {
    apply(compiler) {
        // hooks us when all the assets are emitted in the output directory
        compiler.hooks.afterEmit.tapAsync("deadcodePlugin", (compilation, cb) => {

            getUnusedModules(compilation);

            let usedExports = [], providedExportsObj = [];
            compilation.chunks.forEach((chunk) => {
                // gives us all the modules that are present within a chunk
                compilation.chunkGraph.getChunkModules(chunk).forEach(module => {
                    unUsedExports(compilation, chunk, module, usedExports, providedExportsObj);
                });
            });
            // console.log(providedExportsObj);
            const unusedExports = Object.values(providedExportsObj).filter(x => usedExports && !usedExports.includes(x));
            // console.log(unusedExports);
            cb();
        })
    }
}
function getUnusedModules(compilation) {
    const assets = getWebpackAssets(compilation);
    const compiledFiles = assets.filter(file => file && file.indexOf("node_modules") === -1).reduce((acc, file) => {
        acc[file] = true
        return acc;
    }, {});
    // get all the files in the src/ folder to check if it is used or not. 
    const includedFiles = fg.sync(compilation.compiler.context + '/src/**/*.(js|jsx|css)')
    // filter unused files from included files by using compiled files as a filter 
    let unusedFiles = includedFiles.filter(file => !compiledFiles[file]);
    console.log("These are unused Files..... ")
    console.log(unusedFiles);
}
function getWebpackAssets(compilation) {
    // all the files that are compiled by webpack
    let assets = Array.from(compilation.fileDependencies);
    // console.log(assets);
    const compiler = compilation.compiler;
    const outputPath = compilation.getPath(compiler.outputPath);
    compilation.getAssets().forEach(asset => {
        const assetPath = path.join(outputPath, asset.name);
        assets.push(assetPath);
    });
    return assets;
}
function unUsedExports(compilation, chunk, module, usedExports, providedExportsObj) {
    // it returns all the exports that are there within a module 
    let providedExports = compilation.moduleGraph.getProvidedExports(module);
    if (providedExports instanceof Array) providedExportsObj[module.resource] = providedExports[0];
    // getUsedExports returns the exports that are used in the bundle during the runtime s
    // let usedExports = compilation.moduleGraph.getUsedExports(module , chunk.runtime);
    let exportInfo = compilation.moduleGraph._moduleMap.get(module).exports;
    let exp = Array.from(exportInfo._exports);
    if (exp[0] !== undefined) usedExports.push(exp[0][0]);
    // const unusedExports = providedExports.filter(x => usedExports && !usedExports.includes(x));
    // console.log(usedExports);
}

module.exports = deadcodePlugin;