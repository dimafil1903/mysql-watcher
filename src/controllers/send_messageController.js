const helpers = require('../helpers/helpers');
const {body, query, validationResult} = require('express-validator');
module.exports = (app, db) => {


    let route = "/api/message/send"


    app.post(route, [
            body('type').isIn(["viber", "sms", "email"]),
            body('message').custom((message) => {
                return IsJsonString(message);
            }),
            query('api_key').notEmpty()
        ], (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            if (helpers.check_source_accounts_api_key(req.query, res, db)) {
                helpers.get_source_accounts_by_api_key(db, req.query.api_key, async (source_account) => {
                    let message = await JSON.parse(req.body.message)
                    message.status = "not_sent_yet"
                    message.type = req.body.type
                    message.source_account_id = source_account.dataValues.id
                    message.gateway_id = source_account.default_gateway_id
                    if (req.body.gateway_name) {
                        const gateway = await db.Gateways.findOne({
                            where: {
                                name: req.body.gateway_name
                            }
                        })
                        message.gateway_id = gateway.id
                    }
                    await createMessage(message, req, res)

                })
            }
        }
    );

    async function createMessage(message, req, res) {
        const gateway = await db.Gateways.findOne({
            where: {
                id: message.gateway_id
            }
        })
        if (!gateway) {
            return res.status(400).json({errors: [{'msg': "gateway does not exist"}]});
        }
        if (message.type === "sms" || message.type === "viber") {
            let required = checkRequiredOptions(["text", "number"], message)
            message.number = await validate_number(message.number)
            if (required)
                return res.status(400).json({errors: [{'msg': required + " need to be option of message object "}]});
            if (!message.number)
                return res.status(400).json({errors: [{'msg': "number format is wrong"}]});
            if (!message.gateway_id)
                return res.status(400).json({errors: [{'msg': "gateway_name or default_gateway is not correct"}]});
        }
        if (message.type === "sms") {
            const SmsRes = await db.sms.create(message);
            return res.json(SmsRes)
        } else if (message.type === "viber") {
            message.image = req.body.image
            message.button_link = req.body.button_link
            message.button_text = req.body.button_text
            message.ttl = req.body.ttl
            const viberRes = await db.viber.create(message);
            return res.json(viberRes)
        } else if (message.type === "email") {
            let required = checkRequiredOptions(["emailTo", "title"], message)
            if (required)
                return res.status(400).json({errors: [{'msg': required + " need to be option of message object "}]});


            const emailRes = await db.email.create(message);
            return res.json(emailRes)
        } else {
            res.status = 404
            res.send({"status": "error", "err": "type is wrong"})
            return false
        }

    }


    /**
     * @param options array
     * @param obj object
     */

    function checkRequiredOptions(options, obj) {

        let flag
        options.forEach(element => {
            if (!obj.hasOwnProperty(element)) {

                return flag = element;
            }
            return false
        })

        return flag
    }


    function IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    function validate_number(phone) {
        if (phone.includes("+")) {
            phone = phone.substr(1)
        }
        if (phone.length === 12)
            return phone
        else return false
    }

}