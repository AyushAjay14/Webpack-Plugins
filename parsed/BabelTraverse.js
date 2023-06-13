const swc = require('@swc/core')
const fs = require('fs')
const { getImports } = require('../ast/imports');
const { getExports } = require('../ast/exports');
const { getRelations } = require('../ast/Relations');
const {getDynamicImports} = require('../ast/getDynamicImports');
const { getFunctionDeclaration, getVariableDeclaration } = require('../ast/expression')
const path = __dirname + '/../ast/tests/test3.js'
const data = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });
const globalScopes = [];
let imports, exprts = [];
async function getGlobalScope() {
  let module = await swc.parse(data);
  imports = getImports(module);
  imports.forEach(e => globalScopes.push(e.local));

  module = await swc.parse(data);
  getExports(module).forEach((e) => {if(e.orig) globalScopes.push(e.orig)});
  
  module = await swc.parse(data);
  getDynamicImports(module)

  module = await swc.parse(data);
  for (let exp of module.body) {
    if (exp.type === 'FunctionDeclaration') getFunctionDeclaration(exp, globalScopes)
    else if (exp.type === "VariableDeclaration") getVariableDeclaration(exp, globalScopes);
  }
  module = await swc.parse(data);
  getRelations(module, globalScopes);
}

getGlobalScope();