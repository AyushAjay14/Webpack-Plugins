const {Visitor} = require('@swc/core/Visitor');

class ExpressionClass extends Visitor{
    constructor(globalScopes){
        super();
       this.globalScopes = globalScopes;
    }
    getglobalScopes() {
        return this.globalScopes
    }
    visitVariableDeclarator(n){
        this.globalScopes.push(n.id.value);
        return ;
    }
    visitFunctionDeclaration(decl){
        this.globalScopes.push(decl.identifier.value);
        return ;
    }
}

function getFunctionDeclaration(decl , globalScopes){
    const visitor = new ExpressionClass(globalScopes);
    visitor.visitFunctionDeclaration(decl);
    return visitor.getglobalScopes();
}
function getVariableDeclaration(decl , globalScopes){
    const visitor = new ExpressionClass(globalScopes);
    visitor.visitVariableDeclarator(decl.declarations[0]);
    return visitor.getglobalScopes();
}
function getLocalVariables(stmts){
    const globalScopes = [];
    const visitor = new ExpressionClass(globalScopes);
    visitor.visitStatements(stmts);
    return globalScopes;
  }
exports.getFunctionDeclaration = getFunctionDeclaration;
exports.getVariableDeclaration = getVariableDeclaration;
exports.getLocalVariables = getLocalVariables;