const {Visitor} = require('@swc/core/Visitor')

class RelationClass extends Visitor{
    constructor(callExpression , assignmentExpression){
        super();
        this.parent = null;
        this.parentVariable = null;
        this.callExpression = callExpression;
        this.assignmentExpression = assignmentExpression;
        this.scopeVariables = {};
    }
    getScopes(){
        return this.scopeVariables
    }
    visitFunctionDeclaration(decl){  // declaring parent function and then after its scope ends removing parent
        const params = this.getParams(decl.params);
        if(!this.parent){
            this.parent = decl.identifier.value;
            this.scopeVariables[this.parent] = [];
        }
        super.visitFunctionDeclaration(decl);
        this.parent = null;
    }
    visitVariableDeclarator(n){
        if(n.init.type === 'CallExpression'){   // case - const z = y() calling global function through const z
            // console.log(n)
            if(this.callExpression.includes(n.init.callee.value)){   
                if(!this.scopeVariables[n.id.value]) this.scopeVariables[n.id.value] = [];
                this.scopeVariables[n.id.value].push(n.init.callee.value);
            }
        }
        // if(this.parent) this.scopeVariables[this.parent].push(n.id.value);
        super.visitVariableDeclarator(n)
    }
    visitIdentifier(n){  // if a global variable is change inside any function To add - local Scope 
        if(this.parent && (this.assignmentExpression.includes(n.value) || this.callExpression.includes(n.value))){
            this.scopeVariables[this.parent].push(n.value);
        }
        super.visitIdentifier(n);
    }
    visitExpression(n) {
        if(!this.parentVariable && n.left) {  // case => x = {f : func()}
            this.parentVariable = n.left.value;
            this.scopeVariables[this.parentVariable] = [];
        }
        if(n.type === 'AssignmentExpression' && n.right?.type === 'CallExpression'){  // z = y() calling a global func and storing its value in a variable 
            if(this.callExpression.includes(n.right.callee.value)){
                this.scopeVariables[n.left.value].push(n.right.callee.value);
            }
        }
        super.visitExpression(n)
        this.parentVariable = null;
    }
    visitCallExpression(n) {
        if(this.parentVariable){  // z = {f : func() } z : [func]
             this.scopeVariables[this.parentVariable].push(n.callee.value)
        }
        else if(this.parent){
            this.scopeVariables[this.parent].push(n.callee.value)
        }
        super.visitCallExpression(n);
    }
    getParams(paramsArr){   // get parameters of a function 
        const params = [];
        paramsArr.forEach(element => {
            params.push(element.pat.value)
        });
        return params;
    }
}

function getRelations(module , callExpression , assignmentExpression){  // base function creates instance
    const visitor = new RelationClass(callExpression , assignmentExpression);
    visitor.visitProgram(module);
    console.log(visitor.getScopes())
}
exports.getRelations = getRelations;