const {Visitor} = require('@swc/core/Visitor');

class ExpressionClass extends Visitor{
    constructor(callExpression , assignmentExpression, functionDeclaration){
        super();
        this.callExpression = callExpression;
        this.assignmentExpression = assignmentExpression;
        this.functionDeclaration = functionDeclaration;
    }
    getExpressions(){
        return {calls : this.callExpression , assignment: this.assignmentExpression};
    }
    visitExpression(n){
        if(n.type === 'CallExpression'){
            if(n.callee)this.callExpression.push(n.callee.value);
        }
        else if(n.type === 'AssignmentExpression'){
            if(n.left) this.assignmentExpression.push(n.left.value);
        }
        super.visitExpression(n)
    }
    visitFunctionDeclaration(decl){
        this.functionDeclaration.push(decl.identifier.value);
        super.visitFunctionDeclaration(decl);
    }
}

function getExpressions(stmt , callExpression , assignmentExpression , functionDeclaration){
    const visitor = new ExpressionClass(callExpression , assignmentExpression , functionDeclaration);
    visitor.visitExpression(stmt);
}
function getFunctionDeclaration(decl ,  callExpression , assignmentExpression , functionDeclaration){
    const visitor = new ExpressionClass(callExpression,assignmentExpression, functionDeclaration);
    visitor.visitFunctionDeclaration(decl);
}
exports.getExpressions = getExpressions;
exports.getFunctionDeclaration = getFunctionDeclaration;