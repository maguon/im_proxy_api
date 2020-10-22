const axios = require('axios');
const SystemConfig = require('../config/SystemConfig');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('Client.js');

const getProxy = (req,res,next)=>{
    const query= req.query;
    axios({
        method: 'get',
        baseURL: SystemConfig.mongooseim.client,
        headers: {'authorization': req.headers['authorization']},
        url: req.getPath(),
        params:query
    }).then(function (response) {
        res.status(200);
        res.send({success:true,data:response.data});
    }).catch(function (error) {
        // handle error
        res.status(500);
        res.send(error.message);
        logger.error(req.getPath(),query);
    });
}

const postProxy = (req,res,next)=>{
    const query= req.query;
    const body = req.body;
    axios({
        method: 'post',
        baseURL: SystemConfig.mongooseim.client,
        headers: {'authorization': req.headers['authorization']},
        url: req.getPath(),
        params:query,
        data: body
    }).then(function (response) {
        res.status(200);
        res.send({success:true,data:response.data});
    }).catch(function (error) {
        // handle error
        res.status(500);
        res.send(error.message);
        logger.error(req.getPath(),query,body);
    });
}

const putProxy = (req,res,next)=>{
    const query= req.query;
    const body = req.body;
    axios({
        method: 'put',
        baseURL: SystemConfig.mongooseim.client,
        headers: {'authorization': req.headers['authorization']},
        url: req.getPath(),
        params:query,
        data: body
    }).then(function (response) {
        res.status(200);
        res.send({success:true,data:response.data});
    }).catch(function (error) {
        // handle error
        res.status(500);
        res.send(error.message);
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
    }).catch(function (error) {
        // handle error
        res.status(500);
        res.send(error.message);
        logger.error(req.getPath,query);
    });
}

module.exports = {
    getProxy,postProxy,putProxy,deleteProxy
}