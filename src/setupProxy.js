const proxy = require('http-proxy-middleware');

module.exports = function(app) {
 console.log("setting proxy")
  app.use(proxy('/api', { target: 'http://localhost:8085' }));
  app.use(proxy('/socket.io', { target: 'http://localhost:8085/socket.io', ws: true }));
  // app.use(proxy('/api', { target: 'https://test.iotplatforma.cloud', secure: false, changeOrigin: true }));
  // app.use(proxy('/socket.io', { target: 'https://test.iotplatforma.cloud/socket.io', ws: true, secure: false, changeOrigin: true }));
};
