
const PLUGIN_NAME = "ASTPlugin";

class astPlugin {
    apply(compiler) {
        compiler.hooks.normalModuleFactory.tap('MyPlugin', (factory) => {
            factory.hooks.parser
              .for('javascript/auto')
              .tap('MyPlugin', (parser, options) => {
                // parser.hooks.evaluate.for('FunctionExpression').tap('MyPlugin', (expression) => {
                //     console.log(expression);
                //   });
                parser.hooks.importSpecifier.tap(
                    'MyPlugin',
                    (statement, source, exportName, identifierName) => {
                    //   console.log(source , exportName , identifierName)
                    }
                  );
              });
          });
    }
}

module.exports = astPlugin;