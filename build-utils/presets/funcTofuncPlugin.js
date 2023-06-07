class funcTofuncPlugin {
    constructor() {
        this.name = "funcTofuncPlugin";
    }
    apply(compiler) {
        compiler.hooks.compilation.tap(this.name, (compilation) => {
            compilation.hooks.finishModules.tap(this.name, (modules) => {
                const { _moduleMap: moduleMap } = compilation.moduleGraph;
                let DepMatrix = {};
                let rootOutgoingConnections = [];
                let visitedMap = new Map();
                let previousDependency = null;
                let rootModule = null;
                for (let module of modules) {
                    if (rootModule == null) rootModule = module;
                    this.dfsFunction(compilation, rootModule, previousDependency, DepMatrix, rootOutgoingConnections, visitedMap);
                }
                console.log("Root Outgoing Connections/Dependencies: ")
                console.log(rootOutgoingConnections);
                console.log("Adjacency Matrix of Functions: ([parentDependency Function] : [ChildDependency Functions])")
                for (let [key, value] of Object.entries(DepMatrix)) {
                    console.log(key, ": ", value);
                }
            })
        })
    }
    dfsFunction(compilation, module, previousDependency, DepMatrix, rootOutgoingConnections, visitedMap) {
        if (visitedMap.get(module)) return;
        visitedMap.set(module, true);
        for (let dependency of module.dependencies) {
            if (previousDependency === null) {
                if (dependency instanceof require('webpack/lib/dependencies/HarmonyImportSpecifierDependency') || dependency instanceof require('webpack/lib/dependencies/ImportDependency')) {
                    rootOutgoingConnections.push(dependency.ids.at(-1));
                    this.dfsFunction(compilation, compilation.moduleGraph.getModule(dependency), dependency.ids.at(-1), DepMatrix, rootOutgoingConnections, visitedMap);
                }
                else continue;
            }
            else {
                if (dependency instanceof require('webpack/lib/dependencies/HarmonyImportSpecifierDependency') || dependency instanceof require('webpack/lib/dependencies/ImportDependency')) {
                    if (DepMatrix[previousDependency] === undefined) {
                        DepMatrix[previousDependency] = new Array();
                    }
                    DepMatrix[previousDependency].push(dependency.ids.at(-1));
                    this.dfsFunction(compilation, compilation.moduleGraph.getModule(dependency), dependency.ids.at(-1), DepMatrix, rootOutgoingConnections, visitedMap);
                }
                else continue;
            }
        }
        // console.log)
    }
}
module.exports = funcTofuncPlugin