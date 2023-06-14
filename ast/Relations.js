const { Visitor } = require('@swc/core/Visitor')
const { getLocalVariables } = require('./getScope')
class RelationClass extends Visitor {
    constructor(globalScopes, importDetails) {
        super();
        this.currentGlobalScope = new Set(globalScopes); // all the global scopes - variable, functions 
        this.funcStack = []; // stack to store function calls inside a block 
        this.parent = null;
        this.importDetails = importDetails;
        this.globalParams = new Set(); // all the global parameters inside a block function
        this.checkDynamicObj = { parent: null, import: false }; // check to find out dynamic import
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
        if (!this.checkDynamicObj.parent && (n.init?.type === 'CallExpression' || n.init?.type === 'ArrowFunctionExpression')) this.checkDynamicObj.parent = n.id.value;
        this.funcStack.push(n.id.value); // adding variable call stack for arrow functions 
        super.visitVariableDeclarator(n);
        this.funcStack.pop();
        this.checkDynamicObj.parent = null;
    }
    visitAssignmentExpression(n) {  // for handling x = func() of x = y both in global scopes 
        if (this.currentGlobalScope.has(n.left.value)) {
            if (this.funcStack.length) {
                this.scopeVariables[n.left.value].push(this.funcStack[0]);
            }
            else this.scopeVariables[n.left.value].push('global');
        }
        if (this.currentGlobalScope.has(n.right.value)) {
            if (this.funcStack.length) {
                this.scopeVariables[n.right.value].push(this.funcStack[0]);
            }
        }
        if (this.currentGlobalScope.has(n.left.value)) {
            if (n.right.type === 'CallExpression') { // handling x = f(y) x is a global scope and x -> f and y 
                const funcArgs = this.getFuncArgs(n.right);
                funcArgs ? funcArgs.forEach(arg =>{
                    if(this.currentGlobalScope.has(arg)){
                        this.scopeVariables[arg].push(n.left.value);
                    }
                    this.scopeVariables[n.left.value].push(arg)
                }) : ""
                this.scopeVariables[n.left.value].push(n.right.callee.value);
            }
        }
        if (this.currentGlobalScope.has(n.left.value) && this.currentGlobalScope.has(n.right.value)) {
            this.scopeVariables[n.left.value].push(n.right.value);
        }
        super.visitAssignmentExpression(n);
    }
    visitCallExpression(n) {  // handling all functions calls
        if (this.checkDynamicObj.parent) {
            if (n.callee.type === 'Import') {
                this.checkDynamicObj.import = true;
            }
        }
        let calleeName = null;
        if(n.callee.type === 'MemberExpression'){
            calleeName = n.callee.object?.value;
        }
        else calleeName = n.callee.value;
        const funcArgs = this.getFuncArgs(n); // handling if in any call expression argument is a global parameter
                funcArgs ? funcArgs.forEach(arg =>{
                    if(this.currentGlobalScope.has(arg)){
                        if(this.funcStack.length) this.scopeVariables[arg].push(this.funcStack[0]);
                    }
                }) : ""
        if (this.currentGlobalScope.has(calleeName)) {
            if(this.scopeVariables[calleeName].includes(this.funcStack[0])){
                return ;
            }
            if (this.funcStack.length) {
                this.scopeVariables[calleeName].push(this.funcStack[0]);
            }
            else this.scopeVariables[calleeName].push('global');
        }
        super.visitCallExpression(n);
        if (this.checkDynamicObj.import) {
            this.checkDynamicObj.import = false;
        }
    }
    visitSpreadElement(e) {
        if (e.arguments.value && this.currentGlobalScope.has(e.arguments.value)) {
            if (this.funcStack.length) this.scopeVariables[e.arguments.value].push(this.funcStack[0])
            else this.scopeVariables[e.arguments.value].push('global');
        }
        e.arguments = this.visitExpression(e.arguments);
        return e;
    }
    visitStringLiteral(n) {
        const importName = n.value;
        if (this.checkDynamicObj.parent && this.checkDynamicObj.import) {
            if (this.scopeVariables[this.importDetails.get(importName)]) {
                if (this.funcStack.length) this.scopeVariables[this.importDetails.get(importName)].push(this.funcStack[0]);
                else this.scopeVariables[this.importDetails.get(importName)].push('global');
            }
            else if (this.scopeVariables[importName]) {
                if (this.funcStack.length) this.scopeVariables[importName].push(this.funcStack[0]);
                else this.scopeVariables[importName].push('global');
            }
            else {
                this.scopeVariables[importName] = [];
                if (this.funcStack.length) this.scopeVariables[importName].push(this.funcStack[0]);
                else this.scopeVariables[importName].push('global');
            }
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
    getFuncArgs(right) {
        const funcArgArr = right.arguments;
        const funcArgs = []
        funcArgArr.forEach(e => funcArgs.push(e.expression.value));
        return funcArgs;
    }
}

function getRelations(module, globalScopes, imports) {  // base function creates instance
    const importDetails = new Map();
    for (let imprt of imports) {
        if(imprt.source[imprt.source.length-3] !== '.') imprt.source = imprt.source + '.js'
        importDetails.set(imprt.source , imprt.local);
    }
    const scopeVariables = {};
    for (let scope of globalScopes) {
        scopeVariables[scope] = [];
    }
    const visitor = new RelationClass(globalScopes, importDetails);
    visitor.scopeVariables = scopeVariables;
    visitor.visitProgram(module);
    console.log(visitor.getScopes())
}
exports.getRelations = getRelations;