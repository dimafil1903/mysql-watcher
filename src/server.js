const express = require("express");
const bodyParser = require("body-parser");
const gatewayController = require("./controllers/gatewayController");
const source_accountsController = require("./controllers/source_accountsController");
const messageController = require("./controllers/messageController");
const messageSentController = require("./controllers/messageSentController");

const db = require("../src/models");
const helper= require("../src/helpers/helpers")
const helmet = require('helmet')



const app = express();
app.use(helmet())
// parse requests of content-type: application/json
app.use(bodyParser.json());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
/**
 * ROUTES
 */

gatewayController(app, db);
source_accountsController(app, db);
messageController(app, db)
messageSentController(app, db)

app.all('*', function (req, res) {
    res.status(404).send('route not found');
});


module.exports.server = function () {
    let server = app.listen(3000,  (a) => {
        // let host = server.address().address;
        // let port = server.address().port;
        // console.log(host + ":" + port + " is started");
    });
};