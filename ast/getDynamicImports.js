const {Visitor} = require('@swc/core/Visitor')

class DynamicImportClass extends Visitor{
    constructor(){
        super();
        this.DynamicImports = {};
        this.dynamic = {parent: null , import : false};
    }
    getDynamicImportObj(){
        return this.DynamicImports;
    }
    visitVariableDeclarator(n){
        if(!this.dynamic.parent && (n.init.type === 'CallExpression' || n.init.type === 'ArrowFunctionExpression')) this.dynamic.parent = n.id.value;
        n.id = this.visitPattern(n.id);
        n.init = this.visitOptionalExpression(n.init);
        this.parent = null;
        return n;
    }
    visitCallExpression(n){
        if(this.dynamic.parent){
            if(n.callee.type === 'Import'){
                this.dynamic.import = true;
            }
        }
        n.callee = this.visitCallee(n.callee);
        n.typeArguments = this.visitTsTypeParameterInstantiation(n.typeArguments);
        if (n.arguments) {
            n.arguments = this.visitArguments(n.arguments);
        }
        if(this.dynamic.import){
            this.dynamic.parent = null;
            this.dynamic.import = false;
        }
        return n;
    }
    visitStringLiteral(n){
        if(this.dynamic.parent && this.dynamic.import){
            if(!this.DynamicImports[n.value])this.DynamicImports[n.value] = [];
            this.DynamicImports[n.value].push(this.dynamic.parent);
        }
        return n;
    }
}

function getDynamicImports(module){
    const DynamicImports = {};
    const visitor = new DynamicImportClass();
    visitor.visitProgram(module);
    console.log(visitor.getDynamicImportObj());
}

exports.getDynamicImports = getDynamicImports;