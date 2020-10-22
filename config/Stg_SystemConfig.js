const logLevel = 'DEBUG';
const loggerConfig = {
    appenders: {
        console: { type: 'console' } ,
        file : {
            "type": "file",
            "filename": "../hy_engine_api.html",
            "maxLogSize": 2048000,
            "backups": 10
        }
    },
    categories: { default: { appenders: ['console','file'], level: 'debug' } }
}

const mongooseim = {
    admin :'http://localhost:8088',
    client :'http://localhost:8089'
}
module.exports = { loggerConfig, logLevel,mongooseim}