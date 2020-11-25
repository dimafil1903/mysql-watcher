var axios = require('axios');
var qs = require('qs');
const rax = require('retry-axios');
const interceptorId = rax.attach();

let i=0
let err=0

do {
    try {


        axios({
            method: 'post',
            url: 'https://bridge.dev.smartpointlab.com/api/message/send?api_key=87f87a7c5be2a5e5c6658bfeb16ccb79',
            raxConfig: {
                // Override the decision making process on if you should retry
                shouldRetry: err => {
                    const cfg = rax.getConfig(err);
                    return true;
                }
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify({
                'type': 'sms',
                'message': `{"text":"test ${i}","number":"+380976961719"}`
            })
        })
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                err++
                console.info(err)
            });
        i++
    }catch (e) {
        console.info(e)

    }
}while (i<500)

