const {body, query, validationResult} = require('express-validator');
module.exports = (app, db) => {

    let CallbackRouteIntelTele = "/api/callback/intel-tele"

    app.post(CallbackRouteIntelTele,
        (req, res) => {
            console.log(req.body)
            db.viber.findOne({ where: { message_id: req.body.msgid } })
                .then(function (viberMessage) {
                    // Check if record exists in db
                    if (viberMessage) {
                        viberMessage.update({
                            status: req.body.status
                        })
                            .success(function () {})
                    }
                })
            db.sms.findOne({ where: { message_id: req.body.msgid } })
                .then( function (smsMessage) {
                    // Check if record exists in db
                    if (smsMessage) {
                        smsMessage.update({
                            status: req.body.status
                        })
                            .success(function () {})
                    }
                })
            res.status(200).send()
    })
}