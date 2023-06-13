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
        this.DynamicImports = {};
        this.dynamic = {parent: null , import : false};
    }
    getScopes() {
        return this.scopeVariables
    }
    getDynamicImportObj(){
        return this.DynamicImports;
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
        if(!this.dynamic.parent && (n.init.type === 'CallExpression' || n.init.type === 'ArrowFunctionExpression')) this.dynamic.parent = n.id.value;
        this.funcStack.push(n.id.value); // adding variable call stack for arrow functions 
        super.visitVariableDeclarator(n);
        this.funcStack.pop();
        this.dynamic.parent = null;
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
        }
            if (n.right.type === 'CallExpression') { // handling x = f(y) x is a global scope and x -> f and y 
                const funcArgs = this.getFuncArgs(n.right);
                funcArgs ? funcArgs.forEach(e => this.scopeVariables[n.left.value].push(e)) : ""
                this.scopeVariables[n.left.value].push(n.right.callee.value);
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
        if(this.dynamic.parent){
            if(n.callee.type === 'Import'){
                this.dynamic.import = true;
            }
        }
        if (this.currentGlobalScope.has(n.callee.value)) {
            if (!this.scopeVariables[n.callee.value]) this.scopeVariables[n.callee.value] = []
            if (this.funcStack.length) {
                this.scopeVariables[n.callee.value].push(this.funcStack[0]);
            }
            else this.scopeVariables[n.callee.value].push('global');
        }
        super.visitCallExpression(n);
        if(this.dynamic.import){
            // this.dynamic.parent = null;   
            this.dynamic.import = false;
        }
    }
    visitSpreadElement(e){
        if(e.arguments.value && this.currentGlobalScope.has(e.arguments.value)){
            if (!this.scopeVariables[e.arguments.value]) this.scopeVariables[e.arguments.value] = []
            if(this.funcStack.length) this.scopeVariables[e.arguments.value].push(this.funcStack[0])
            else this.scopeVariables[e.arguments.value].push('global');
        }
        e.arguments = this.visitExpression(e.arguments);
        return e;
    }
    visitStringLiteral(n){
        const importName = n.value;
        if(this.dynamic.parent && this.dynamic.import){
            if(!this.DynamicImports[importName])this.DynamicImports[importName] = [];
            if(this.funcStack.length) this.DynamicImports[importName].push(this.funcStack[0]);
            else this.DynamicImports[importName].push('global');
        }
        return n;
    }
    getParams(paramsArr) {   // get parameters of a function 
        const params = [];
        paramsArr.forEach(element => {
            params.push(element.pat.value)
        });
        return params;
    }
    getFuncArgs(right){
        const funcArgArr = right.arguments;
        const funcArgs = []
        funcArgArr.forEach(e => funcArgs.push(e.expression.value));
        return funcArgs;
    }
}

function getRelations(module, globalScopes) {  // base function creates instance
    const DynamicImports = {};
    const visitor = new RelationClass(globalScopes);
    visitor.visitProgram(module);
    console.log(visitor.getDynamicImportObj());
    console.log(visitor.getScopes())
}
exports.getRelations = getRelations;