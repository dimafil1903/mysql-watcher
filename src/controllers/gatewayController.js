const helpers = require('../helpers/helpers');
const {body, query, validationResult} = require('express-validator');

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
            body('auth').notEmpty(),
            body('name').notEmpty(),
            body('api_name').notEmpty(),
            body('type').isIn(["viber", "sms", "email"]),
        ], (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()});
            }
            if (helpers.check_admin_api_key(req.query, res, db)) {
                let gateway = new db.Gateways()
                gateway.set("auth", req.body.auth)
                gateway.set("type", req.body.type)
                gateway.set("name", req.body.name)
                gateway.set("api_name", req.body.api_name)
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
            body('auth').notEmpty(),
            body('name').notEmpty(),
            body('api_name').notEmpty(),
            body('type').isIn(["viber", "sms", "email"]),
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
                gateway.set("auth", req.body.auth)
                gateway.set("type", req.body.type)
                gateway.set("name", req.body.name)
                gateway.set("api_name", req.body.api_name)
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