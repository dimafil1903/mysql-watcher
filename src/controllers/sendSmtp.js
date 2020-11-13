const nodemailer = require("nodemailer");
const db = require("../models");

// async..await is not allowed in global scope, must use a wrapper
class sendSmtp {
    result
    async send(message) {
        async function main() {
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
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: gateway.get('auth')
            });

// send mail with defined transport object
            let info = await transporter.sendMail({
                from: message.emailFrom || source_account.email, // sender address
                to: message.emailTo, // list of receivers
                subject: message.title, // Subject line
                text: message.text, // plain text body
                html: message.html, // html body
            });

// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }

        await main().then((item) => {
            /**
             * TODO WEBHOOK and  EDIT EMAIL IS SENDED
             */
            console.log("\nsucces\n")
            console.log(item)
            this.result = true
        }).catch((item) => {
            console.log(item)
            this.result = false
        })

    }
}

module.exports.sendSmtp = sendSmtp