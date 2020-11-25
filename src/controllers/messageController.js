const helpers = require('../helpers/helpers');
const {query, validationResult} = require('express-validator');
let validator = require('validator');
const avaliable_api = require('../config/avaliable_api');

module.exports = (app, db) => {


    let route = "/api/message"
    app.get(route + "/getStatus", [
            query('type').isIn(["viber", "sms", "email"]),
            query('message_id').notEmpty(),
            query('api_key').notEmpty()
        ], (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            let ids = req.query.message_id.split(',');

            // console.log(ids)
            if (helpers.check_source_accounts_api_key(req.query, res, db)) {
                helpers.get_source_accounts_by_api_key(db, req.query.api_key, async (source_account) => {
                    let result = undefined
                    if (!source_account)
                        return res.status(400).json({errors: [{'msg': "wrong api_key"}]});

                    if (req.query.type === "viber")
                        result = await db.viber.findAll({
                            attributes: ['id', "type", 'status', "createdAt", "updatedAt"],
                            where: {
                                id: ids,
                                source_account_id: source_account.id
                            }
                        })
                    else if (req.query.type === "sms")
                        result = await db.sms.findAll({
                            attributes: ['id', "type", 'status', "createdAt", "updatedAt"],
                            where: {
                                id: ids,
                                source_account_id: source_account.id
                            }
                        })
                    else if (req.query.type === "email")
                        result = await db.email.findAll({
                            attributes: ['id', "type", 'status', "createdAt", "updatedAt"],
                            where: {
                                id: ids,
                                source_account_id: source_account.id
                            }
                        })


                    if (result && Array.isArray(result) && result.length)
                        return res.json(result)
                    else return res.status(400).json({err: "no data"})
                })
            }
        }
    );

    app.post(route + "/send", [
            query('type').isIn(["viber", "sms", "email"]),
            query('message').custom((message) => {
                return IsJsonString(message);
            }),
            query('api_key').notEmpty()

        ], (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }

            helpers.get_source_accounts_by_api_key(db, req.query.api_key, async (source_account) => {
                if (!source_account)
                    return res.status(400).json({errors: [{'msg': "wrong api_key"}]});
                let message = await JSON.parse(req.query.message)
                console.log(message)
                if (!message.emailFrom) {
                    message.emailFrom = source_account.email
                }
                message.status = "not_sent_yet"
                message.type = req.query.type
                message.source_account_id = source_account.dataValues.id
                message.gateway_id = source_account.default_gateway_id
                if (req.query.gateway_name) {
                    const gateway = await db.Gateways.findOne({
                        where: {
                            name: req.query.gateway_name
                        }
                    })
                    if (gateway) {
                        message.gateway_id = gateway.id
                        message.api_name = gateway.api_name
                    } else return res.status(400).json({errors: [{'msg': "this gateway does not exist"}]});
                }
                await createMessage(message, req, res)

            })

        }
    );

    async function createMessage(message, req, res) {
        let required = await helpers.checkRequiredOptions(Object.keys(message), avaliable_api[message.api_name]["message"]["req"])
        if (required) {
            return res.status(400).json({
                errors: [{
                    'msg': `struct message for ${message.api_name} is wrong (${required} is required)`,
                    [message.api_name]: avaliable_api[message.api_name]["message"]
                }]
            });
        }
        if (message.type === "sms" || message.type === "viber") {
            message.number = await split_numbers(message.number)
            if (!message.number)
                return res.status(400).json({errors: [{'msg': "number format is wrong"}]});
            if (!message.gateway_id)
                return res.status(400).json({errors: [{'msg': "gateway_name or default_gateway is not correct"}]});
        }
        if (message.type === "sms") {
            console.log(message)
            const SmsRes = await db.sms.create(message);
            return res.json(SmsRes)
        } else if (message.type === "viber") {
            const viberRes = await db.viber.create(message);
            return res.json(viberRes)
        } else if (message.type === "email") {
            if (!validator.isEmail(message.emailTo)) {
                return res.status(400).json({errors: [{'msg': "emailTo: '" + message.emailTo + "' is not email"}]});
            }

            if (!validator.isEmail(message.emailFrom)) {
                return res.status(400).json({errors: [{'msg': "emailFrom: '" + message.emailFrom + "' is not email"}]});
            }

            const emailRes = await db.email.create(message);
            return res.json(emailRes)
        } else {
            res.status = 400
            res.send({"status": "error", "err": "type is wrong"})
            return false
        }
    }


    function IsJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    function split_numbers(str) {
        let phone_Arr = str.split(",");

        phone_Arr.forEach((phone, index) => {
            if (phone)
                phone_Arr[index] = validate_number(phone.trim())
            else
                delete phone_Arr[index]
        });

        return phone_Arr.join(",")

    }

    function validate_number(phone) {

        return phone.toString().replace("+", "");

    }

}