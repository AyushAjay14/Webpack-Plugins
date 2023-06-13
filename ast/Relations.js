const { Visitor } = require('@swc/core/Visitor')
const { getLocalVariables } = require('./getScope')
class RelationClass extends Visitor {
    constructor(globalScopes) {
        super();
        this.currentGlobalScope = new Set(globalScopes);
        this.funcStack = [];
        this.parent = null;
        this.scopeVariables = {};
        this.scopeVariables = {};
        this.globalParams = new Set();
    }
    getScopes() {
        return this.scopeVariables
    }
    visitBlockStatement(block) {  // scope of a function block
        let localvar = getLocalVariables(block.stmts);
        let stack = [];
        for (let scope of localvar) {
            if (this.currentGlobalScope.has(scope)) {
                this.currentGlobalScope.delete(scope);
                stack.push(scope);
            }
        }
        for (let scope of this.globalParams) {
            if (this.currentGlobalScope.has(scope)) {
                this.currentGlobalScope.delete(scope);
                stack.push(scope);
            }
        }
        super.visitBlockStatement(block);
        for (let scope of stack) {
            this.currentGlobalScope.add(scope);
        }
    }
    visitFunctionDeclaration(decl) {  // declaring parent function and then after its scope ends removing parent
        if (!this.parent) this.parent = decl.identifier.value;
        this.funcStack.push(decl.identifier.value); // adding function call stack 
        let localParams = [];
        localParams = this.getParams(decl.params);
        for (let param of localParams) this.globalParams.add(param)
        super.visitFunctionDeclaration(decl);
        this.funcStack.pop();
        for (let param of localParams) {
            this.globalParams.delete(param);
        }
        this.parent = null;
    }
    visitVariableDeclarator(n) {
        if (!this.parent) this.parent = n.id.value;
        this.funcStack.push(n.id.value); // adding variable call stack for arrow functions 
        super.visitVariableDeclarator(n);
        this.funcStack.pop();
        this.parent = null;
    }
    visitIdentifier(n) {  // if a global variable is changed inside any function
        super.visitIdentifier(n);
    }
    visitAssignmentExpression(n) {  // for handling x = func() of x = y both in global scopes 
        if (this.currentGlobalScope.has(n.left.value)) {
            if (!this.scopeVariables[n.left.value])
                this.scopeVariables[n.left.value] = []
            if (this.funcStack.length) {
                this.scopeVariables[n.left.value].push(this.funcStack[0]);
            }
            else this.scopeVariables[n.left.value].push('global');
        }
        if (this.currentGlobalScope.has(n.right.value)) {
            if (!this.scopeVariables[n.right.value])
                this.scopeVariables[n.right.value] = []
            if (this.funcStack.length) {
                this.scopeVariables[n.right.value].push(this.funcStack[0]);
            }
            else this.scopeVariables[n.right.value].push('global');
        }
        if (this.currentGlobalScope.has(n.left.value) && this.currentGlobalScope.has(n.right.value)) {
            if (!this.scopeVariables[n.left.value])
                this.scopeVariables[n.left.value] = []
            if (!this.scopeVariables[n.right.value])
                this.scopeVariables[n.right.value] = []
            this.scopeVariables[n.left.value].push(n.right.value);
        }
        super.visitAssignmentExpression(n);
    }
    visitCallExpression(n) {  // handling all functions calls
        if (this.currentGlobalScope.has(n.callee.value)) {  
            if (!this.scopeVariables[n.callee.value]) this.scopeVariables[n.callee.value] = []
            if (this.funcStack.length) {
                this.scopeVariables[n.callee.value].push(this.funcStack[0]);
            }
            else this.scopeVariables[n.callee.value].push('global');
        }
        super.visitCallExpression(n);
    }
    getParams(paramsArr) {   // get parameters of a function 
        const params = [];
        paramsArr.forEach(element => {
            params.push(element.pat.value)
        });
        return params;
    }
}

function getRelations(module, globalScopes) {  // base function creates instance
    const visitor = new RelationClass(globalScopes);
    visitor.visitProgram(module);
    console.log(visitor.getScopes())
}
exports.getRelations = getRelations;