const { Visitor } = require('@swc/core/Visitor');
class ExportClass extends Visitor {
    constructor() {
        super();
        this.Exports = { members: [] };
    }
    getExportArr() {
        return this.Exports;
    }
    visitExportAllDeclaration(n) {
        this.Exports.exportall = (this.Exports.exportall || []).concat(n.source.value);
        super.visitExportAllDeclaration(n);
    }
    visitExportDeclaration(n) {
        if (n.declaration.type === 'FunctionDeclaration') {
            this.Exports.members.push({
                orig: n.declaration.identifier.value,
                local: null
            })
        }
        if (n.declaration.type === 'VariableDeclaration') {
            this.Exports.members.push({
                name: n.declaration.declarations[0]?.id.value,
                type: n.declaration.declarations[0]?.init.type
            })
        }
        super.visitExportDeclaration(n);
    }
    visitExportNamedDeclaration(n) {
        for (let specifier of n.specifiers) {
            const dep = getSpecifiers(specifier)
            if (dep) {
                this.Exports.members.push({
                    ...dep
                })
            }
        }
    }
    visitDefaultDeclaration(n) {
        if (n.type === 'FunctionExpression') {
            this.Exports.members.push({
                orig: n.identifier.value,
            },)
        }
        super.visitDefaultDeclaration(n)
    }

}
function getExports(module) {
    const visitor = new ExportClass();
    visitor.visitProgram(module)
    return visitor.getExportArr().members;
}
function getSpecifiers(specifier) {
    if (!specifier) return;
    if (specifier.type === 'ExportSpecifier') {
        const orig = specifier.orig.value;
        return {
            orig,
        }
    }
    return null;
}
exports.getExports = getExports;
exports.default = getExports;