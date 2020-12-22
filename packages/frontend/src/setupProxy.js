const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    console.log("setting proxy")
    //   app.use(proxy('/api', { target: 'http://localhost:8085' }));
    //   app.use(proxy('/socket.io', { target: 'http://localhost:8085', ws: true }));
    app.use(proxy('/api', { target: 'https://v2.iotplatforma.cloud', secure: false, changeOrigin: true }));
    app.use(proxy('/socket.io', { target: 'https://v2.iotplatforma.cloud', ws: true, secure: false, changeOrigin: true }));
    app.use(proxy('/images', { target: 'https://v2.iotplatforma.cloud', secure: false, changeOrigin: true }));
};
