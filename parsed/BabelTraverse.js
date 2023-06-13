const swc = require('@swc/core')
const fs = require('fs')
const {getImports} = require('../ast/imports');
const {getExports} = require('../ast/exports');
const {getRelations} = require('../ast/Relations')
const {getFunctionDeclaration, getVariableDeclaration} = require('../ast/expression')
const path = __dirname + '/../ast/tests/test.js'
const data = fs.readFileSync(path , { encoding: 'utf8', flag: 'r' });
const globalScopes = [];
let imports , exprts = [] ;
async function getGlobalScope(){
  let module = await swc.parse(data);
  imports = getImports(module);
  imports.forEach(e => globalScopes.push(e.local));

  module = await swc.parse(data);
  getExports(module).forEach((e) => exprts.push(e.orig));
  console.log(exprts);

  module = await swc.parse(data);
  for(let exp of module.body){
    if(exp.type === 'FunctionDeclaration') getFunctionDeclaration(exp, globalScopes)
    else if(exp.type==="VariableDeclaration") getVariableDeclaration(exp, globalScopes);
  }
  module = await swc.parse(data);
  getRelations(module , globalScopes);
}

getGlobalScope();