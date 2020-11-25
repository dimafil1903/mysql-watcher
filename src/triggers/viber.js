let intele = require("../controllers/intelteleController")
const db = require("../models");
const axios = require('axios');

module.exports = (instance, MySQLEvents) => {
    instance.addTrigger({
        name: 'monitoring inserts messages',
        expression: 'app_bridge.vibers', // listen to TEST database !!!
        statement: MySQLEvents.STATEMENTS.INSERT, // you can choose only insert for example MySQLEvents.STATEMENTS.INSERT, but here we are choosing everything
        onEvent: e => {
            /****
             *
             *SEND TO GATEWAY
             */

            e.affectedRows.forEach(async element => {
                console.log(element.after)
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
                let message = new intele.intelteleController()
                message.createMessage(element.after.number, source_account.name, element.after.text)
                message.auth(gateway.get("auth"))
                let result = await message.sendViber(element.after.image, element.after.button_text, element.after.button_link, element.after.ttl)
                try {
                    await db.viber.update(
                        {
                            message_id: message.message_id,
                            status:"sent"
                        }, {
                            where: {
                                id: element.after.id
                            }
                        });
                    console.log(result)
                } catch (e) {
                    console.log(e)
                }
            })
        }
    });


    instance.addTrigger({
        name: 'monitoring updating status',
        expression: 'app_bridge.vibers.status', // listen to TEST database !!!
        statement: MySQLEvents.STATEMENTS.UPDATE, // you can choose only insert for example MySQLEvents.STATEMENTS.INSERT, but here we are choosing everything
        onEvent: e => {
            /****
             *
             *SEND TO source_accounts if he have webhook_url
             */

            e.affectedRows.forEach(async element => {
                console.log(element.after)
                let source_account = await db.source_accounts.findOne({
                    where: {
                        id: element.after.source_account_id
                    }
                })
                if (source_account.webhook_url) {
                    axios.post(source_account.webhook_url, this.result).then((res) => {
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
        }
    });
}