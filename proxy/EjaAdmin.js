const axios = require('axios');
const SystemConfig = require('../config/SystemConfig');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('EjaAdmin.js');

const getProxy = (req,res,next)=>{
    const query= req.query;
    axios({
        method: 'get',
        baseURL: SystemConfig.ejabberd.admin,
        headers: {'authorization': req.headers['authorization']},
        url: req.getPath(),
        params:query
    }).then(function (response) {
        res.status(200);
        res.send({success:true,data:response.data});
        logger.info(' getProxy ' + 'success');
    }).catch(function (error) {
        // handle error
        res.send(error);
        logger.error(req.getPath(),error.stack);
        // res.status(error.response.status);
        // res.send(error.response.statusText);
        // logger.error(req.getPath(),query);
    });
}

const postProxy = (req,res,next)=>{
    const query= req.query;
    const body = req.body;
    const adminUser = new Buffer(SystemConfig.ejabberd.adminname + ':' + SystemConfig.ejabberd.password).toString('base64');
    axios({
        method: 'post',
        baseURL: SystemConfig.ejabberd.admin,
        headers: {'authorization': 'Basic ' + adminUser},
        url: '/api' + req.getPath().substr(11),
        params:query,
        data: body
    }).then(function (response) {
        res.status(200);
        res.send({success:true,data:response.data});
        logger.info(' postProxy ' + 'success');
    }).catch(function (error) {
        // handle error
        res.status(error.response.status);
        res.send(error.response.statusText);
        logger.error(req.getPath(),query,body);
    });
}

const putProxy = (req,res,next)=>{
    const query= req.query;
    const body = req.body;
    axios({
        method: 'put',
        baseURL: SystemConfig.mongooseim.admin,
        url: req.getPath(),
        params:query,
        data: body
    }).then(function (response) {
        res.status(200);
        res.send({success:true,data:response.data});
        logger.info(' putProxy ' + 'success');
    }).catch(function (error) {
        // handle error
        res.status(error.response.status);
        res.send(error.response.statusText);
        logger.error(req.getPath(),query,body);
    });
}

const deleteProxy = (req,res,next)=>{
    const query= req.query;
    axios({
        method: 'delete',
        baseURL: SystemConfig.mongooseim.admin,
        url: req.getPath(),
        params:query
    }).then(function (response) {
        res.status(200);
        res.send({success:true,data:response.data});
        logger.info(' deleteProxy ' + 'success');
    }).catch(function (error) {
        // handle error
        res.status(error.response.status);
        res.send(error.response.statusText);
        logger.error(req.getPath,query);
    });
}

module.exports = {
    getProxy, postProxy, putProxy, deleteProxy
}