module.exports = function (api) {
     api.cache(true)

     const config = {
          presets: [
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
          ],
          plugins: [
               [
                    'module-resolver',
                    {
                         root: ['./src'],
                         alias: {
                              framework: './src/modules/framework',
                              "fieldDescriptors": "./src/modules/frontend/src/validations/fieldDescriptors",
                              'framework-ui': './src/modules/framework-ui',
                              frontend: './src/modules/frontend',
                              backend: './src/modules/backend'
                         }
                    }
               ],
               // ["transform-inline-environment-variables", {
               //      "include": [
               //        "NODE_ENV"
               //      ]
               //    }]
          ],
          // ignore: [(filename) => {
          //      // console.log({ filename })
          //      if (/\/node_modules\//.test(filename))
          //           return true

          //      return false
          // }]
          // je třeba ignorovat reactí soubory ve framework-ui a frontentu
          ignore: [/node_modules\//]
     }

     return config
}
