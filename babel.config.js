module.exports = function(api) {
     api.cache(true)

     const presets = [
          [
               '@babel/preset-env',
               {
                    loose: true,
                    modules: 'commonjs',
                    targets: {
                         node: 'current'
                    },
                    useBuiltIns: 'entry'
               }
          ]
     ]
     const plugins = [
          [
               'module-resolver',
               {
                    root: ['./src'],
                    alias: {
                         framework: './src/modules/framework',
                         "fieldDescriptors": "./src/modules/frontend/src/validations/fieldDescriptors",
                         'framework-ui': './src/modules/framework-ui',
                         frontend: './src/modules/frontend'
                    }
               }
          ]
     ]

     return {
          presets,
          plugins
     }
}
