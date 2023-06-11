const swc = require('@swc/core')
const fs = require('fs')
const { newVisitor } = require('../ast/newVisitor')
let visitor = new newVisitor();
const path = __dirname + '/../src/a.js'
const data = fs.readFileSync(path , { encoding: 'utf8', flag: 'r' });
swc.parse(data).then((module) => {
  for(let decl of module.body){
    visitor.visitModuleItem(decl);
  }
  const globalScopes = visitor.getGlobalScopes();
  console.log(globalScopes)
  const globalScopeArr = {};
  globalScopeArr.FunctionCalls = [];
  for(let key of globalScopes.ExpressionStatements.CallExpression){
    globalScopeArr.FunctionCalls.push(key);
  }
  const obj = visitor.getGlobalScopes();
  fs.writeFileSync(__dirname + '/../ast/ast-a.json' , JSON.stringify(obj) );
})