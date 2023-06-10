"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visitor = void 0;
const {Visitor} = require("@swc/core/Visitor")
class myVisitor extends Visitor{
    constructor(){
        super();
        this.globalScopes = {};
        this.allImports = {};
        this.allFunctionDeclarations = {};
        this.allVariableDeclarations = {};
        this.source;
        this.parent = {};
        this.currentFunction;
        this.Export = {isExport: false , typeOfExport: null};
        this.ExpressionStatments = {};
    }
    getGlobalScopes(){
        this.globalScopes = {'ImportDeclarations' : this.allImports , 'FunctionDeclarations': this.allFunctionDeclarations , 'VariableDeclerations': this.allVariableDeclarations , 'ExpressionStatements': this.ExpressionStatments};
        return this.globalScopes;
    }
    setIndex(){
        this.index = 0;
    }
    visitImportDeclaration(n){
        this.allImports[n.source.value] = {};
        this.source = n.source.value;
        return ;
    }
    visitImportDefaultSpecifier(node) {
        this.globalScopes['ImportDeclarations'][node.source.value] = {local : node.local.value}
        return ;

    }
    visitImportNamespaceSpecifier(node) {
        this.globalScopes['ImportDeclarations'][node.source.value] = {local : node.local.value}
        return ;
    }
    visitImportDefaultSpecifier(node) {
        this.globalScopes['ImportDeclarations'][node.source.value] = {local : node.local.value};
        return ;
    }
    visitNamedImportSpecifier(node){
        this.allImports[this.source] = {...{local : node.local.value}}
        if (node.imported) {
            this.allImports[this.source] = {...this.allImports[this.source] , imported : node.imported.value}
        }
        return ;
    }
    visitModuleItem(n){
        this.Export.typeOfExport = n.type;
        super.visitModuleItem(n)
    }
    visitExportDeclaration(n){
        this.Export.isExport = true;
        super.visitExportDeclaration(n);
    }
    visitExportDefaultDeclaration(n){
        this.Export.isExport = true;
        super.visitExportDefaultDeclaration(n);
    }
    visitFunctionDeclaration(declr){
        if(this.Export.isExport){
            this.allFunctionDeclarations[declr.identifier.value + ` (${this.Export.typeOfExport})`] = {};
            this.Export = {};
        }
        else this.allFunctionDeclarations[declr.identifier.value] = {};
        this.currentFunction = declr.identifier.value;
        return ;
    }
    visitVariableDeclarator(n) {
        if(this.Export.isExport){
            this.allVariableDeclarations[n.id.value + ` (${this.Export.typeOfExport}) (${n.init.type})`] = {};
            this.Export = {};
        }
        else this.allVariableDeclarations[n.id.value + ` (${n.init.type})`] = {};
        return ;
    }
    visitCallExpression(n){
        if(!this.ExpressionStatments[n.type]) this.ExpressionStatments[n.type] = [];
        if(n.callee.value)this.ExpressionStatments[n.type].push(n.callee.value);
        return;
    }
}
exports.Visitor = myVisitor;
exports.default = myVisitor;