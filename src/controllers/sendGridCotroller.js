const sgMail = require('@sendgrid/mail');
const db = require("../models");

class sendGrid {
    mail = sgMail
    res = undefined

    auth(auth) {
        this.mail.setApiKey(auth.api_key);
    }

    async send(message) {
        const source_account = await db.source_accounts.findOne({
            where: {
                id: message.source_account_id
            }
        })
        const msg = {
            to: message.emailTo,
            from: message.emailFrom || source_account.email, // Use the email address or domain you verified above
            subject: message.title,
            text: message.text,
            html: message.html,
        };
//ES6
        await this.mail
            .send(msg)
            .then((res) => {
                this.res = res
            }, error => {
                console.error(error);
                this.res = error
                if (error.response) {
                    console.error(error.response.body)
                }
            });

        return this.res
    }
}

module.exports.sendGrid = sendGrid