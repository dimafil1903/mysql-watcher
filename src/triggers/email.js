const smtp = require("../controllers/sendSmtp")
const sendGrid = require("../controllers/sendGridCotroller")
const emailExistence = require("email-existence");

const db = require("../models");

module.exports = (instance, MySQLEvents) => {
    instance.addTrigger({
        name: 'monitoring inserts messages',
        expression: 'app_bridge.emails', // listen to TEST database !!!
        statement: MySQLEvents.STATEMENTS.INSERT, // you can choose only insert for example MySQLEvents.STATEMENTS.INSERT, but here we are choosing everything
        onEvent: e => {
            /****
             *
             *SEND TO GATEWAY
             */
            e.affectedRows.forEach(async element => {
                let source_account = await db.source_accounts.findOne({
                    where: {
                        id: element.after.source_account_id
                    }
                })
                let gateway = await db.Gateways.findOne({
                    where: {
                        id: element.after.gateway_id
                    }
                })
                console.log(element)
               emailExistence.check(element.after.emailTo, async function (error, response) {
                    if (response) {
                        let result
                        if (gateway.api_name === "send_grid") {
                            let email = new sendGrid.sendGrid
                            email.auth(gateway.get('auth'))
                            result = email.send(element.after)
                        } else if (gateway.api_name === "smtp") {
                            let email = new smtp.sendSmtp()
                            result = await email.send(element.after)
                        }
                        console.log(result)
                        if (result===true) {
                            db.email.update(
                                {
                                    status: "OK"
                                }, {
                                    where: {
                                        id: element.after.id
                                    }
                                });
                        }

                    } else {
                        db.email.update(
                            {
                                status: "rejected"
                            }, {
                                where: {
                                    id: element.after.id
                                }
                            });
                    }
                });


                const errHandler = err => {
                    //Catch and log any error.
                    console.error("Error: ", err);
                };
            })
        }
    });
}