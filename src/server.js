const express = require("express");
const bodyParser = require("body-parser");
const gatewayController = require("./controllers/gatewayController");
const source_accountsController = require("./controllers/source_accountsController");
const send_messageController = require("./controllers/send_messageController");
const messageController = require("./controllers/messageController");
const winston = require('winston')
const db = require("../src/models");
const helper= require("../src/helpers/helpers")

const myWinstonOptions = {
    transports: [
        new winston.transports.File({ filename: 'logs/'+helper.formatDate()+'.log'}),
    ]
}
const logger = new winston.createLogger(myWinstonOptions)

function logRequest(req, res, next) {
    logger.info(req.url)
    next()
}

function logError(err, req, res, next) {
    logger.error(err)
    next()
}

const app = express();

// parse requests of content-type: application/json
app.use(bodyParser.json());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
/**
 * ROUTES
 */
app.use(logRequest)
app.use(logError)
gatewayController(app, db);
source_accountsController(app, db);
send_messageController(app, db)
messageController(app, db)

app.all('*', function (req, res) {
    res.status(404).send('route not found');
});


module.exports.server = function () {
    let server = app.listen(3000, "127.0.0.1", (a) => {
        let host = server.address().address;
        let port = server.address().port;
        console.log(host + ":" + port + " is started");
    });
};