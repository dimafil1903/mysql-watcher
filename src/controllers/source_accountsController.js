const helpers = require('../helpers/helpers');
const { query, validationResult} = require('express-validator');

module.exports = (app, db) => {

    let single = "/api/source_account"
    let plural = "/api/source_accounts"


    /**
     * admin
     */
    app.get(plural, [
            query('api_key').notEmpty()
        ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
            if (helpers.check_admin_api_key(req.query, res, db)) {
                db.source_accounts.findAll().then((result) => res.json(result))
                    .catch(function (err) {
                        res.send(err.parent.sqlMessage)
                    })
            }


        }
    );
    /**
     * admin
     */
    app.get(single + "/:id", [
            query('api_key').notEmpty()
        ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
            if (helpers.check_admin_api_key(req.query, res, db)) {
                db.source_accounts.findByPk(req.params.id).then((result) => {

                    res.json(result)
                }).catch(function (err) {
                    res.send(err.parent.sqlMessage)
                })
            }
        }
    );
    /**
     * service
     */
    app.get(single, [
            query('api_key').notEmpty()
        ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
            if (helpers.check_source_accounts_api_key(req.query, res, db)) {
                db.source_accounts.findOne({
                    where: {
                        api_key: req.query.api_key
                    }
                }).then((result) => {
                    res.json(result)
                }).catch(function (err) {
                    res.send(err.parent.sqlMessage)
                })
            }
        }
    );
    /**
     * admin
     */
    app.post(single, [
            query('api_key').notEmpty(),
            query('name').notEmpty(),
            query('email').notEmpty()
        ], async (req, res) =>  {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
            if (helpers.check_admin_api_key(req.query, res, db)) {
                let   gateway

                if (req.query.default_gateway_name){
                 gateway = await db.Gateways.findOne({
                    where: {
                        name: req.query.default_gateway_name

                    }
                })}
                if(gateway) {
                    db.source_accounts.create({
                        name: req.query.name,
                        email: req.query.email,
                        webhook_url: req.query.webhook_url,
                        default_gateway_id: gateway.id
                    }).then((result) => res.json(result)).catch(function (err) {
                        res.send(err.parent.sqlMessage)
                    })
                }else {
                    res.send({"status": "error", "msg": "no gateway with this name"})
                }
            }
        }
    );
    /**
     * admin
     */
    app.put(single + "/:id", [
            query('api_key').notEmpty(),
            query('name').notEmpty(),
            query('email').notEmpty()
        ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
            if (helpers.check_admin_api_key(req.query, res, db)) {
                db.source_accounts.update({
                        name: req.query.name,
                        email: req.query.email,
                        webhook_url: req.query.webhook_url
                    },
                    {
                        where: {
                            id: req.params.id
                        }
                    }).then((result) => res.json(result))
            }
        }
    );
    /**
     * admin
     */
    app.delete(single + "/:id", [
            query('api_key').notEmpty(),
        ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
            if (helpers.check_admin_api_key(req.query, res, db)) {
                db.source_accounts.destroy({
                    where: {
                        id: req.params.id
                    }
                }).then((result) => res.json(result))
            }
        }
    );
}