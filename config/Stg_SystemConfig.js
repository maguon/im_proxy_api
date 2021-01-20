const logLevel = 'DEBUG';
const loggerConfig = {
    appenders: {
        console: { type: 'console' } ,
        file : {
            "type": "file",
            "filename": "../im_proxy_api.html",
            "maxLogSize": 2048000,
            "backups": 10
        }
    },
    categories: { default: { appenders: ['console','file'], level: 'debug' } }
}

const ejabberd = {
    admin :'http://im.myxxjs.com:5280',
    client :'http://im.myxxjs.com:5280',
    adminname :'admin@im.myxxjs.com',
    password :'123456'
}

module.exports = { loggerConfig, logLevel,ejabberd}