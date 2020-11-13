const helpers = require('../helpers/helpers');
const {body, query, validationResult} = require('express-validator');
module.exports = (app, db) => {


    let route = "/api/message"
    app.post(route+"/getStatus", [
            body('type').isIn(["viber", "sms", "email"]),
            body('message_id').notEmpty(),
            query('api_key').notEmpty()
        ], (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            if (helpers.check_source_accounts_api_key(req.query, res, db)) {
                helpers.get_source_accounts_by_api_key(db, req.query.api_key, async (source_account) => {
                    let result = undefined
                    if (req.query.type === "viber") {
                        result = await db.vibers.findOne({
                            where: {
                                message_id: req.query.message_id
                            }
                        })

                    } else if (req.query.type === "sms") {
                        result = await db.vibers.findOne({
                            where: {
                                message_id: req.query.message_id
                            }
                        })
                    } else if (req.query.type === "email") {
                        result = await db.vibers.findOne({
                            where: {
                                message_id: req.query.message_id
                            }
                        })
                    }
                    if (result)
                    return res.json(result)
                    else return res.status(404).json({err:"no data"})
                })
            }
        }
    );

}