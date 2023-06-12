const {Visitor} = require('@swc/core/Visitor');
class ExportClass extends Visitor{
    constructor(){
        super();
        this.Exports = {members : [] };
    }
    getExportArr(){
        return this.Exports;
    }
    visitExportAllDeclaration(n){
        this.Exports.exportall = (this.Exports.exportall || []).concat(n.source.value);
        super.visitExportAllDeclaration(n);
    }
    visitExportDeclaration(n) {
        if(n.declaration.type === 'FunctionDeclaration'){
            this.Exports.members.push({
                orig: n.declaration.identifier.value,
                local: null
            })
        }
        if(n.declaration.type === 'VariableDeclaration'){
            this.Exports.members.push({
                name: n.declaration.declarations[0]?.id.value,
                type: n.declaration.declarations[0]?.init.type
            })
        }
        super.visitExportDeclaration(n);
    }
    visitExportNamedDeclaration(n) {
        const dep = getSpecifiers(n.specifiers[0])
        if(dep){
            this.Exports.members.push({
                ...dep
            })
        }
    }
    visitDefaultDeclaration(n){
        if(n.type === 'FunctionExpression'){
            this.Exports.members.push({
                orig: n.identifier.value,
                local: 'DEFAULT',
              },)
        }
        super.visitDefaultDeclaration(n)
    }
    
}
function getExports(module){
    const visitor = new ExportClass();
    visitor.visitProgram(module)
    return visitor.getExportArr();
} 
function getSpecifiers(specifier){
    if(!specifier) return ;
    if(specifier.type === 'ExportSpecifier'){
        const orig = specifier.orig.value;
        return{
            orig,
            local: specifier.exported?.value || 'NAMED_EXPORT'
        }
    }
  return null;
}
exports.getExports = getExports;
exports.default = getExports;