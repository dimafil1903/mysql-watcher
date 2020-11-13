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

    constructor(number, from, message) {
        this.viber.to = this.sms.to = number;
        this.sms.to = this.viber.sms_source = this.viber.im_sender = from;
        this.sms.message = this.viber.im_message = this.viber.sms_message = message;
    }

    auth(auth) {
        this.sms.username = this.viber.username = auth.username
        this.sms.api_key = this.viber.api_key = auth.api_key
    }

    sendViber(image, button_text, button_link, ttl) {


        this.viber.im_image = image
        this.viber.im_button_text = button_text
        this.viber.im_button_link = button_link
        this.viber.im_ttl = ttl
        console.log(this.viber)

        axios.get('http://api.sms.intel-tele.com/im/send/', this.viber).then((res) =>
            this.reply = res.data.reply
        ).catch(error => {
            console.log(error.request.data)
        });

    }

    sendSms(priority, system_type) {
        this.sms.priority = priority
        this.sms.system_type = system_type
        console.log(this.sms)

        axios.get('http://api.sms.intel-tele.com/message/send/', this.sms).then((res) => {
                this.reply = res.data.reply
                try {
                    this.message_id = res.data.reply['message_id']
                } catch (e) {
                    console.log(e)
                }
            }
        ).catch(error => {
            console.log(error)
        });
        return this.reply
    }


}

module.exports.intelteleController = intelteleController;
