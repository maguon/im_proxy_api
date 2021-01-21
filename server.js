const path = require('path');
const restify = require('restify');
const Errors = require('restify-errors');
const corsMiddleware = require('restify-cors-middleware');
const Admin = require('./proxy/Admin');
const Client = require('./proxy/Client');
const EjaAdmin = require('./proxy/EjaAdmin');
const EjaClient = require('./proxy/EjaClient');

const createServer=()=>{



    const server = restify.createServer({

        name: 'IM_PROXY_API',
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

    //------------------------------------admin------------------------------------

    //Commands
    server.get('/api/commands',Admin.getProxy);

    //User management
    server.get('/api/users/:XMPPHost',Admin.getProxy);
    server.post({path:'/api/users/:XMPPHost',contentType: 'application/json'}, Admin.postProxy);
    server.put({path:'/api/users/:XMPPHost/:username',contentType: 'application/json'}, Admin.putProxy);
    server.del('/api/users/:XMPPHost/:username', Admin.deleteProxy);

    //Session management
    server.get('/api/sessions/:XMPPHost',Admin.getProxy);
    server.del('/api/sessions/:XMPPHost/:username/:resource', Admin.deleteProxy);

    //One-to-one messages
    // server.post({path:'/api/messages',contentType: 'application/json'}, Admin.postProxy);
    // server.get('/api/messages/:owner',Admin.getProxy);
    server.get('/api/messages/:owner/:with',Admin.getProxy);

    //Contacts
    server.get('/api/contacts/:user',Admin.getProxy);
    server.post({path:'/api/contacts/:user',contentType: 'application/json'}, Admin.postProxy);
    server.del('/api/contacts/:user/:contact', Admin.deleteProxy);
    server.put({path:'/api/contacts/:user/:contact',contentType: 'application/json'}, Admin.putProxy);
    server.put({path:'/api/contacts/:user/:contact/manage',contentType: 'application/json'}, Admin.putProxy);

    //MUV-light management
    server.post({path:'/api/muc-lights/:XMPPHost',contentType: 'application/json'}, Admin.postProxy);
    server.put({path:'/api/muc-lights/:XMPPHost',contentType: 'application/json'}, Admin.putProxy);
    server.post({path:'/api/muc-lights/:XMPPHost/:roomName/participants',contentType: 'application/json'}, Admin.postProxy);
    server.post({path:'/api/muc-lights/:XMPPHost/:roomName/messages',contentType: 'application/json'}, Admin.postProxy);
    server.del('/api/muc-lights/:XMPPHost/:roomName/:user/management', Admin.deleteProxy);

    //MUC management
    server.post({path:'/api/mucs/:XMPPHost',contentType: 'application/json'}, Admin.postProxy);
    server.post({path:'/api/mucs/:XMPPHost/:roomName/participants',contentType: 'application/json'}, Admin.postProxy);
    server.post({path:'/api/mucs/:XMPPHost/:roomName/messages',contentType: 'application/json'}, Admin.postProxy);
    server.del('/api/mucs/:XMPPHost/:roomName/nickname', Admin.deleteProxy);


    //------------------------------------client------------------------------------

    //One-to-one messages
    server.get('/api/messages',Client.getProxy);
    server.post({path:'/api/messages',contentType: 'application/json'}, Client.postProxy);
    server.get('/api/messages/:with',Client.getProxy);

    //Rooms
    server.get('/api/rooms',Client.getProxy);
    server.post({path:'/api/rooms',contentType: 'application/json'}, Client.postProxy);
    server.get('/api/rooms/:id',Client.getProxy);
    server.put({path:'/api/rooms/:id',contentType: 'application/json'}, Client.putProxy);
    server.put({path:'/api/rooms/:id/config',contentType: 'application/json'}, Client.putProxy);
    server.post({path:'/api/rooms/:id/users',contentType: 'application/json'}, Client.postProxy);
    server.del('/api/rooms/:id/users/:user', Client.deleteProxy);
    server.get('/api/rooms/:id/messages',Client.getProxy);
    server.post({path:'/api/rooms/:id/messages',contentType: 'application/json'}, Client.postProxy);

    //Contacts
    server.del('/api/contacts', Client.deleteProxy);
    server.get('/api/contacts',Client.getProxy);
    server.post({path:'/api/contacts',contentType: 'application/json'}, Client.postProxy);
    server.del('/api/contacts/:contacts', Client.deleteProxy);
    server.put({path:'/api/contacts/:contacts',contentType: 'application/json'}, Client.putProxy);

    //Server Sent Events
    server.get('/api/see',Client.getProxy);


    //-----------------------------------ejabberd_admin------------------------------------

    //User management
    server.post({path:'/api/server/register',contentType: 'application/json'}, EjaAdmin.postProxy);
    server.post({path:'/api/server/registered_users',contentType: 'application/json'}, EjaAdmin.postProxy);
    server.post({path:'/api/server/get_last',contentType: 'application/json'}, EjaAdmin.postProxy);
    server.post({path:'/api/server/get_presence',contentType: 'application/json'}, EjaAdmin.postProxy);
    server.post({path:'/api/server/get_roster',contentType: 'application/json'}, EjaAdmin.postProxy);

    //Rooms management
    server.post({path:'/api/server/create_room',contentType: 'application/json'}, EjaAdmin.postProxy);
    server.post({path:'/api/server/create_room_with_opts',contentType: 'application/json'}, EjaAdmin.postProxy);
    server.post({path:'/api/server/destroy_room',contentType: 'application/json'}, EjaAdmin.postProxy);
    server.post({path:'/api/server/get_room_affiliation',contentType: 'application/json'}, EjaAdmin.postProxy);
    server.post({path:'/api/server/get_room_affiliations',contentType: 'application/json'}, EjaAdmin.postProxy);
    server.post({path:'/api/server/get_room_occupants',contentType: 'application/json'}, EjaAdmin.postProxy);
    server.post({path:'/api/server/get_room_occupants_number',contentType: 'application/json'}, EjaAdmin.postProxy);
    server.post({path:'/api/server/get_room_options',contentType: 'application/json'}, EjaAdmin.postProxy);
    server.post({path:'/api/server/get_subscribers',contentType: 'application/json'}, EjaAdmin.postProxy);
    server.post({path:'/api/server/get_user_rooms',contentType: 'application/json'}, EjaAdmin.postProxy);
    //没有访问权限 不好用
    server.post({path:'/api/client/get_user_rooms',contentType: 'application/json'}, EjaClient.postProxy);


    //Msg management
    server.post({path:'/api/server/get_offline_count',contentType: 'application/json'}, EjaAdmin.postProxy);
    server.post({path:'/api/server/kick_session',contentType: 'application/json'}, EjaAdmin.postProxy);
    server.post({path:'/api/server/kick_user',contentType: 'application/json'}, EjaAdmin.postProxy);

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