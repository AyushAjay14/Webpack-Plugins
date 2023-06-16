const swc = require('@swc/core');
const fs = require('fs')
const { getImports } = require('../imports');
const { getExports } = require('../exports');
const { getFunctionDeclaration, getVariableDeclaration } = require('../expression')
const { getRelations } = require('../Relations');
const data = fs.readFileSync(__dirname + '/typescriptTests/test-9.tsx', { encoding: 'utf8', flag: 'r' })
const globalScopes = [];
let imports = [];
async function jsxParser() {
    let module = await swc.transform(data, {
        filename: "parsed.js",
    })
    const code = module.code;
    module = await swc.parse(code)
    imports = getImports(module);
    imports.forEach(e => globalScopes.push(e.local));

    module = await swc.parse(code);
    getExports(module).forEach((e) => { if (e.orig) globalScopes.push(e.orig) });

    module = await swc.parse(code);
    for (let exp of module.body) {
        if (exp.type === 'FunctionDeclaration') getFunctionDeclaration(exp, globalScopes)
        else if (exp.type === "VariableDeclaration") getVariableDeclaration(exp, globalScopes);
    }
    module = await swc.parse(code);
    getRelations(module, globalScopes, imports);
}

jsxParser();