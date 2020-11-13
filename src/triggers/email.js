const smtp=require("../controllers/sendSmtp")
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
            e.affectedRows.forEach( async element => {
                let source_account = await db.source_accounts.findOne({
                    where: {
                        id: element.after.source_account_id
                    }
                })
                console.log(element)
             let email=new  smtp.sendSmtp()
                email.send(element.after).then(result => {
                    if (source_account.webhook_url) {
                        axios.post(source_account.webhook_url, result).then((res) => {
                                /**
                                 * TODO SAVE info about this
                                 */
                                console.log(res)

                            }
                        ).catch(error => {
                            /**
                             * TODO SAVE info about this
                             */
                            console.log(error)
                        });
                    }
                })

                const errHandler = err => {
                    //Catch and log any error.
                    console.error("Error: ", err);
                };
            })
        }
    });
}