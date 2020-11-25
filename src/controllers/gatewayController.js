const helpers = require('../helpers/helpers');
const {query, validationResult} = require('express-validator');
const avaliable_api = require('../config/avaliable_api');

module.exports = (app, db) => {

    let single = "/api/gateway"
    let plural = "/api/gateways"

    app.get(plural, [
            query('api_key').notEmpty(),
        ], (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            if (helpers.check_admin_api_key(req.query, res, db)) {
                db.Gateways.findAll().then((result) => res.json(result)).catch(function (err) {
                    res.send(err.parent.sqlMessage)
                })
            }
        }
    );

    app.get(single + "/:id", [
            query('api_key').notEmpty(),
        ], (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            if (helpers.check_admin_api_key(req.query, res, db)) {
                db.Gateways.findByPk(req.params.id).then((result) => res.json(result)).catch(function (err) {
                    res.send(err.parent.sqlMessage)
                })
            }
        }
    );

    app.post(single, [
            query('api_key').notEmpty(),
            query('auth').notEmpty(),
            query('name').notEmpty(),
            query('api_name').notEmpty(),
            query('type').isIn(["viber", "sms", "email"]),
        ], async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            if (helpers.check_admin_api_key(req.query, res, db)) {
                if (!helpers.check_api_name(req.query.api_name))
                    return res.status(400).send({"status": "error", "err": "NO such api_name"})
                let required = await helpers.checkRequiredOptions(Object.keys(JSON.parse(req.query.auth)), avaliable_api[req.query.api_name]["auth"])
                if (required) {
                    let api_name = req.query.api_name
                    return await res.status(400).json({
                        errors: [{
                            'msg': `struct auth for ${api_name} is wrong`,
                            [api_name]: avaliable_api[req.query.api_name]["auth"]
                        }]
                    });
                }

                let gateway = new db.Gateways()
                gateway.set("auth", req.query.auth)
                gateway.set("type", req.query.type)
                gateway.set("name", req.query.name)

                gateway.set("api_name", req.query.api_name)
                gateway.save().then((result) => {
                    console.log(result)
                    res.send(result)
                }).catch(function (err) {
                    res.status(404).send(err)
                })

            }
        }
    );

    app.put(single + "/:id", [
            query('api_key').notEmpty(),
            query('auth').notEmpty(),
            query('name').notEmpty(),
            query('api_name').notEmpty(),
            query('type').isIn(["viber", "sms", "email"]),
        ], async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            if (helpers.check_admin_api_key(req.query, res, db)) {
                let gateway = await db.Gateways.findOne({
                    where: {
                        id: req.params.id
                    }
                })
                let required = await helpers.checkRequiredOptions(Object.keys(JSON.parse(req.query.auth)), avaliable_api[req.query.api_name]["auth"])
                if (required) {
                    let api_name = req.query.api_name
                    return await res.status(400).json({
                        errors: [{
                            'msg': `struct auth for ${api_name} is wrong`,
                            [api_name]: avaliable_api[req.query.api_name]["auth"]
                        }]
                    });
                }
                gateway.set("auth", req.query.auth)
                gateway.set("type", req.query.type)
                gateway.set("name", req.query.name)
                gateway.set("api_name", req.query.api_name)
                gateway.save().then((result) => {
                    console.log(result)
                    res.send(result)
                }).catch(function (err) {
                    res.status(404).send(err)
                })

            }
        }
    );

    app.delete(single + "/:id", [
            query('api_key').notEmpty(),
        ], (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            if (helpers.check_admin_api_key(req.query, res, db))
                db.Gateways.destroy({
                    where: {
                        id: req.params.id
                    }
                }).then((result) => res.json(result)).catch(function (err) {
                    res.send(err.parent.sqlMessage)
                })
        }
    );
}