const { merge } = require("webpack-merge");
module.exports = (env) => {
  const { presets } = env;
  const mergedPresets = [].concat(...[presets]);
  const mergedConfigs = mergedPresets.map((presetName) =>
    require(`./presets/webpack.${presetName}`)(env)
  );
//   console.log(merge({}, ...mergedConfigs));
  return merge({}, ...mergedConfigs);
};
