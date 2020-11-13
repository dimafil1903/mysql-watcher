
const configs=require("./config.json")
let mode=process.env.NODE_ENV || 'development'

module.exports = {
    HOST: configs[mode].host,
    USER: configs[mode].username,
    PASSWORD: configs[mode].password,
    DB: configs[mode].database
};