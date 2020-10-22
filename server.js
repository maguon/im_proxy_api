const path = require('path');
const restify = require('restify');
const Errors = require('restify-errors');
const corsMiddleware = require('restify-cors-middleware');
const Admin = require('./proxy/Admin');
const Client = require('./proxy/Client');

const createServer=()=>{



    const server = restify.createServer({

        name: 'SNS-API',
        version: '0.0.1'
    });

    server.pre(restify.pre.sanitizePath());
    server.pre(restify.pre.userAgentConnection());

    const corsAllowHeadersArray =[]
    corsAllowHeadersArray.push('auth-token');
    corsAllowHeadersArray.push('user-name');
    corsAllowHeadersArray.push('user-type');
    corsAllowHeadersArray.push('user-id');
    corsAllowHeadersArray.push("Access-Control-Allow-Origin");
    corsAllowHeadersArray.push("Access-Control-Allow-Credentials");
    corsAllowHeadersArray.push("GET","POST","PUT","DELETE");
    corsAllowHeadersArray.push("Access-Control-Allow-Headers","accept","api-version", "content-length", "content-md5","x-requested-with","content-type", "date", "request-id", "response-time");
    const cors = corsMiddleware({

        allowHeaders:corsAllowHeadersArray
    })
    server.pre(cors.preflight);
    server.use(cors.actual);

    server.use(restify.plugins.throttle({
        burst: 100,
        rate: 50,
        ip: true
    }));
    server.use(restify.plugins.bodyParser({uploadDir:__dirname+'/../uploads/'}));
    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.dateParser());
    server.use(restify.plugins.authorizationParser());
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.gzipResponse());

    server.get('/docs/*', // don't forget the `/*`
        restify.plugins.serveStaticFiles('./public/docs')
    );
    //admin
    server.get('/api/users/:XMPPHost',Admin.getProxy);
    server.post({path:'/api/users/:XMPPHost',contentType: 'application/json'}, Admin.postProxy);
    server.put({path:'/api/users/:XMPPHost/:username',contentType: 'application/json'}, Admin.putProxy);
    server.del('/api/users/:XMPPHost/:username', Admin.deleteProxy);
    //client

    server.get('/api/rooms',Client.getProxy);
    server.post({path:'/api/rooms',contentType: 'application/json'}, Client.postProxy);
    server.put({path:'/api/rooms/:id',contentType: 'application/json'}, Client.putProxy);
    server.del('/api/rooms/:id/users/:user', Client.deleteProxy);

    server.on('NotFound', function (req, res ,err,next) {
        const error = new Errors.NotFoundError()
        res.send(error);
        return next();
    });
    return (server);

}

module.exports = {
    createServer
}