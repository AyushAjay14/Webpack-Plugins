const {Visitor} = require('@swc/core/Visitor');
class ImportClass extends Visitor{
    constructor(){
        super();
        this.Imports = [];
    }
    getImportArr(){
        return this.Imports;
    }
    visitImportDeclaration(n) {
        let name , local;
        const dep = getSpecifiers(n.specifiers[0]);
        if(dep){
             name = dep.name ;
             local = dep.local;
        }
        this.Imports.push({
            source: n.source.value,
            name,
            local
        })
        super.visitImportDeclaration(n);
    }
}
function getImports(module){
    let visitor = new ImportClass();
    visitor.visitProgram(module)
    const imports = visitor.getImportArr();
    return imports;
} 
function getSpecifiers(specifier){
    if(!specifier) return ;
    const local = specifier?.local?.value;
    switch (specifier.type) {
        case "ImportDefaultSpecifier":
            return {
                name:'MODULE_DEFAULT',
                local
            }
        case "ImportNamespaceSpecifier":
            return{
                name:'MODULE_ALL',
                local
            }
            
        case "ImportSpecifier":
            return{
                name:specifier.imported?.value || 'DEFAULT',
                local
            }
        default:
            return{
                name: "SIDE_EFFECT_IMPORT",
                local: null
            }
    }
  return null;
}
exports.getImports = getImports;
exports.default = getImports;