const swc = require('@swc/core')
const fs = require('fs')
const { Visitor } = require('@swc/core/Visitor')
const visitor = new Visitor();
const path = __dirname + '/../src/a.js'
const data = fs.readFileSync(path , { encoding: 'utf8', flag: 'r' });
swc.parse(data).then((module) => {
  visitor.visitProgram(module)
  const obj = {imports: visitor.getImports() , functionDecleration: visitor.getFunctions() , variableDecleration: visitor.getVariables()}
  console.log(obj)
  fs.writeFileSync(__dirname + '/../ast/ast-a.json' , JSON.stringify(obj) );
})