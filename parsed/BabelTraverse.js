const swc = require('@swc/core')
const fs = require('fs')
const {getImports} = require('../ast/imports');
const {getExports} = require('../ast/exports');
const {getRelations} = require('../ast/Relations')
const {getExpressions , getFunctionDeclaration, getVariableDeclaration} = require('../ast/expression')
const path = __dirname + '/../src/test.js'
const data = fs.readFileSync(path , { encoding: 'utf8', flag: 'r' });
const moduleStats = {};
let imports , exprts , temp;
swc.parse(data).then((module) => {
  temp = module;
  imports = getImports(module);
  console.log("imports: ",imports)
})
swc.parse(data).then((module) => {
  exprts = getExports(module);
  console.log("exports:" ,exprts)
})
swc.parse(data).then((module) => {
})
const callExpression = [] , assignmentExpression = [] , functionDeclaration = [];
async function getExprssions(){
  let module = await swc.parse(data);
  for(let exp of module.body){
    if(exp.type === 'ExpressionStatement') await getExpressions(exp.expression , callExpression , assignmentExpression , functionDeclaration);
    else if(exp.type === 'FunctionDeclaration') await getFunctionDeclaration(exp, callExpression , assignmentExpression , functionDeclaration)
    else if(exp.type==="VariableDeclaration") await getVariableDeclaration(exp, callExpression , assignmentExpression , functionDeclaration);
  }
  console.log(callExpression ,assignmentExpression , functionDeclaration)
  module = await swc.parse(data);
  getRelations(module , callExpression , assignmentExpression )
}
getExprssions();