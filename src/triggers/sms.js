let intele = require("../controllers/intelteleController")
const axios = require('axios');
const db = require("../models");
module.exports = (instance, MySQLEvents) => {
    instance.addTrigger({
        name: 'monitoring inserts messages',
        expression: 'app_bridge.sms', // listen to TEST database !!!
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
                let result = await message.sendSms(element.after.priority, element.after.system_type)
                try {
                    await db.sms.update(
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

                if (source_account.webhook_url) {
                    await axios.post(source_account.webhook_url, result).then((res) => {
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