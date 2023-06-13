// esm -> default, named, and aliased named import 
import esmDefaultImport, { esmImport, ESM_CONSTANTS as ESM_IMPORT_CONSTANT  } from './esmImportExamplePath';

 

// lib  version change affects 
import dynamicImportLib, { DEFAULT_DYNAMIC_OPTION } from '@sprinklr/dynamicPath';

 

// type only import
// import type { TypeOnlyImport } from '../typeOnlyExamplePath';

 

// cjs 
const cjsImport = require('./cjsImportExamplePath');

 

// dynamic import 
const dynamicallyDefaultImportedWebpackChunk = dynamicImportLib(
  () => import(/*webpackChunkName: "dyn-default-imported-chunk-name"*/ './dynamicallyDefaultImportedPath'), 
  { option: DEFAULT_DYNAMIC_OPTION }
);

 

const dynamicallyNamedImportedWebpackChunk = dynamicImportLib(
  () => import(/*webpackChunkName: "dyn-named-imported-chunk-name"*/ './dynamicallyNamedImportedPath')
  .then(mod => mod.NamedMember), 
  { option: DEFAULT_DYNAMIC_OPTION }
);

 

// constant 
const SELF_CONSTANT = {
  ...ESM_IMPORT_CONSTANT,
  A: 'A',
};

 

const FACTORY_KEY = '@@factoryKey';

 


const firstOrderFnNoSameModulesDeps = () => {
  const cjsLocalImport = require('./cjsLocalImportExamplePath');
}

 

const firstOrderFn = function () {
  cjsImport();
  esmImport(SELF_CONSTANT);
  esmDefaultImport(() => SELF_CONSTANT);
}

 

const highestOrder = () => {
  const penultimateOrder = () => {
    ESM_IMPORT_CONSTANT;
    firstOrderFn();
    return esmImport();
    // karan param change x=>x+1
  }
  return penultimateOrder;
  esmDefaultImport();
}

 

// recursive fn
const recursiveFn = () => {
  recursiveFn();
  firstOrderFnNoSameModulesDeps();
}

 

const dynamicImportConsumer = async () => {
  const y = await dynamicallyDefaultImportedWebpackChunk();
  firstOrderFnNoDeps();
  recursiveFn();
}

 


const FACTORY_MAP = {
  [FACTORY_KEY]: dynamicImportConsumer,
  'RECURSIVE': recursiveFn,
  'FIRST_ORDER': firstOrderFn,
}

 

const getFromFactory = (type) => {
  switch (type) {
    case FACTORY_KEY:
      return dynamicImportConsumer;
    case 'RECURSIVE':
      return recursiveFn;
    default:
  }
}

 

export const x = () => {
  const highestOrder = () => {
  }

  const y = () => {
      highestOrder();
  }
}

 

const fnInvokationOfSecondOrder = highestOrder();

 

export default dynamicImportConsumer;

 

export {SELF_CONSTANT, highestOrder, recursiveFn, firstOrderFn as firstOrderAliasedFn, fnInvokationOfSecondOrder };