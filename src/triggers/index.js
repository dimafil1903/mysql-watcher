const sms=require("./sms")
const viber=require("./viber")
const email=require("./email")

module.exports=(instance,MySQLEvents)=>{
    sms(instance,MySQLEvents)
    viber(instance,MySQLEvents)
    email(instance,MySQLEvents)

}