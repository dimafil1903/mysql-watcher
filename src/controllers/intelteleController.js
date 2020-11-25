const axios = require('axios');

class intelteleController {

    /**
     *
     * @param number number to send
     * @param from name from
     * @param message
     */
    viber = {}
    sms = {}

    reply = undefined
    message_id = undefined

    createMessage(number, from, message) {
        this.viber.to = this.sms.to = number;
        this.sms.from = this.viber.im_sender = from;
        this.sms.message = this.viber.im_message = message;
    }

    auth(auth) {
        this.sms.username = this.viber.username = auth.username
        this.sms.api_key = this.viber.api_key = auth.api_key
    }

    async sendViber(image, button_text, button_link, ttl) {
        this.viber.im_image = image
        this.viber.im_button_text = button_text
        this.viber.im_button_link = button_link
        this.viber.im_ttl = ttl
        console.log(this.viber)

        await axios.get('http://api.sms.intel-tele.com/im/send/', {params: this.viber}).then((res) => {

                this.reply = res.data.reply
                try {
                    this.message_id = res.data.reply[0].message_id
                } catch (e) {
                    this.reply = e
                }

            }
        ).catch(error => {
            this.reply = error.response.data
        });

        return this.reply
    }

    async sendSms(priority, system_type) {
        this.sms.priority = priority
        this.sms.system_type = system_type
        console.log(this.sms)


        await axios.get('http://api.sms.intel-tele.com/message/send/', {params: this.sms}).then((res) => {
                this.reply = res.data.reply
                try {
                    this.message_id = res.data.reply[0].message_id
                } catch (e) {
                    console.log(e)
                }
            }
        ).catch(error => {
            this.reply = error.response.data
        });
        return this.reply
    }

    async check_status(message_ids) {
        if (message_ids) {
            if (message_ids === 'object')
                message_ids.join(',')
            this.sms.requests = message_ids
            await axios.get("http://api.sms.intel-tele.com/message/status/", {params: this.sms})
        }
        return false
    }


}

module.exports.intelteleController = intelteleController;
