const nodemailer = require("nodemailer");
const db = require("../models");

// async..await is not allowed in global scope, must use a wrapper
class sendSmtp {
    result

    async send(message) {

        // let testAccount = await nodemailer.createTestAccount();
        const gateway = await db.Gateways.findOne({
            where: {
                id: message.gateway_id
            }
        })

        // console.log(gateway.get('auth'))
        const source_account = await db.source_accounts.findOne({
            where: {
                id: message.source_account_id
            }
        })
// create reusable transporter object using the default SMTP transport

        let transporter = nodemailer.createTransport({
            host: gateway.get('auth').host,
            port: gateway.get('auth').port ||587,
            secure: false, // true for 465, false for other ports
            auth: gateway.get('auth')//user pass
        });
        await transporter.sendMail({
            from: message.emailFrom || source_account.email, // sender address
            to: message.emailTo, // list of receivers
            subject: message.title, // Subject line
            text: message.text, // plain text body
            html: message.html, // html body
        }).then(i => {
            if (i)
                this.result = true
        }).catch(err => {
            this.result = err
        });

// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        return this.result
    }


}

module.exports.sendSmtp = sendSmtp