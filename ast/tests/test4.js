import a from '../../src/a'
const dynamicallyNamedImportedWebpackChunk = dynamicImportLib(
    () => import(/*webpackChunkName: "dyn-named-imported-chunk-name"*/ './dynamicallyNamedImportedPath')
        .then(mod => mod.NamedMember),
    { option: DEFAULT_DYNAMIC_OPTION }
);
const x = 10;
function hello(){
    const getImports = dynamicImportLib(
        () => import('../../src/a.js').then(() => import('./b').then(() => import('./anything').then("heloo world"))),
        { option: DEFAULT_DYNAMIC_OPTION }
    );
    return getImports;
}
const checker = () => {
    import('./c.js').then("console.log");
    a();
}
const spread = "sometihng";
const spread1 = "sometihng";

const getSpread = {
    ...spread,
    ...spread1
}