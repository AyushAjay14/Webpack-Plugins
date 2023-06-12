const {Visitor} = require('@swc/core/Visitor')

class RelationClass extends Visitor{
    constructor(callExpression , assignmentExpression){
        super();
        this.parent = null;
        this.callExpression = callExpression;
        this.assignmentExpression = assignmentExpression;
        this.scopeVariables = {};
        this.parentScope = [{scoped : new Set()  , dependents: [] }];
        this.currentScope = {scoped : new Set()  , dependents: [] };
    }
    getScopes(){
        return this.scopeVariables
    }
    visitFunctionDeclaration(decl){
        if(!this.parent){
            this.parent = decl.identifier.value;
            this.scopeVariables[this.parent] = [];
        }
        this.currentScope.scoped.add(decl.identifier.value);
        super.visitFunctionDeclaration(decl);
        this.parent = null;
    }
    visitVariableDeclarator(n){
        if(this.parent) this.scopeVariables[this.parent].push(n.id.value);
        super.visitVariableDeclarator(n)
    }
    visitIdentifier(n){
        if(this.parent && (this.assignmentExpression.includes(n.value) || this.callExpression.includes(n.value))){
            this.scopeVariables[this.parent].push(n.value);
        }
        super.visitIdentifier(n);
    }
}

function getRelations(module , callExpression , assignmentExpression){
    const visitor = new RelationClass(callExpression , assignmentExpression);
    visitor.visitProgram(module);
    console.log(visitor.getScopes())
}
exports.getRelations = getRelations;