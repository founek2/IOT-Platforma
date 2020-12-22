const { rewireWorkboxInject, defaultInjectConfig } = require('react-app-rewire-workbox');
const path = require('path');

const {
    override: over,
    babelInclude,
    addBabelPreset,
    addExternalBabelPlugin,
} = require('customize-cra');

// module.exports = override(
//     addExternalBabelPlugin("@babel/plugin-transform-react-jsx"),
// );

module.exports = function override(config, env) {
    if (env === "production") {
        console.log("Production build - Adding Workbox for PWAs");
        // Extend the default injection config with required swSrc
        const workboxConfig = {
            ...defaultInjectConfig,
            maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
            swSrc: path.join(__dirname, 'src', 'sw.js'),
        };
        config = rewireWorkboxInject(workboxConfig)(config, env);
    }
    config = over(addExternalBabelPlugin("@babel/plugin-transform-react-jsx"))(config, env)

    return config;
};