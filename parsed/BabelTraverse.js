const swc = require('@swc/core')
const fs = require('fs')
const { Visitor } = require('../ast/newVisitor')
const visitor = new Visitor();
const path = __dirname + '/../src/a.js'
const data = fs.readFileSync(path , { encoding: 'utf8', flag: 'r' });
swc.parse(data).then((module) => {
  for(let decl of module.body){
    visitor.visitModuleItem(decl);
  }
  console.log(visitor.getGlobalScopes());
  const obj = visitor.getGlobalScopes();
  fs.writeFileSync(__dirname + '/../ast/ast-a.json' , JSON.stringify(obj) );
})