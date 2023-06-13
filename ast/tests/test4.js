const dynamicallyNamedImportedWebpackChunk = dynamicImportLib(
    () => import(/*webpackChunkName: "dyn-named-imported-chunk-name"*/ './dynamicallyNamedImportedPath')
    .then(mod => mod.NamedMember), 
    { option: DEFAULT_DYNAMIC_OPTION }
  );
  const x = 10;
  const getFoot = () =>{
    import('./a.js').then(() => import('./b'))
  }