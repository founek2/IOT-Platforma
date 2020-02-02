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
                         useBuiltIns: 'usage',
                         corejs: "3.6"
                    }
               ],
               "@babel/preset-react"    // just for BE build
          ],
          plugins: [
               [
                    'module-resolver',
                    {
                         root: ['./src'],
                         alias: {
                              'framework': './src/modules/framework',
                              "fieldDescriptors": "./src/modules/frontend/src/validations/fieldDescriptors",
                              'framework-ui': './src/modules/framework-ui',
                              'frontend': './src/modules/frontend',
                              'backend': './src/modules/backend'
                         }
                    }
               ],
               "@babel/plugin-proposal-class-properties", // just for BE build
               "@babel/plugin-syntax-dynamic-import" // just for BE build
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
