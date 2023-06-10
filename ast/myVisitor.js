"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visitor = void 0;
const {Visitor} = require("@swc/core/Visitor")
class myVisitor extends Visitor{
    constructor(){
        super();
    }
    
}
exports.Visitor = myVisitor;
exports.default = myVisitor;