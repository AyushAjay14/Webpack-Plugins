const { Visitor } = require('@swc/core/Visitor');

class LocalScopeClass extends Visitor{
    constructor(globalScopes){
        super();
        this.globalVar = globalScopes;
    }
    getGlobalScope(){
        return this.globalVar;
    }
    visitProgram(n) {
        this.globalVar = [];
        switch (n.type) {
            case "Module":
                return this.visitModule(n);
            case "Script":
                return this.visitScript(n);
        }
    }
    visitFunctionDeclaration(decl){

        this.globalVar.push(decl.identifier.value);
        return decl;
    }
    visitVariableDeclaration(n) {
      for(let curr of n.declarations){
        this.globalVar.push(curr.id.value);
      }
      return n;
    }
};
function getLocalVariables(stmts){
    const globalScopes = [];
    const visitor = new LocalScopeClass(globalScopes);
    visitor.visitStatements(stmts);
    return visitor.getGlobalScope();
  }

exports.getLocalVariables =getLocalVariables ;