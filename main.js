'use strict'
const myServer = require('./server');

(() =>{

    const server = myServer.createServer();
    server.listen(5000, () => {

        console.log('IM_PROXY_API server has been  started ,listening at %s', server.url);
    });
})();