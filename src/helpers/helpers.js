const api_keys = require('../config/api_keys');

module.exports.check_admin_api_key = function check_admin_api_key(query, res, db) {
    if (api_keys().includes(query.api_key))
        return true
    else
        res.send("error api_key")
    return false
}
module.exports.check_source_accounts_api_key = function check_source_accounts_api_key(query, res, db) {
    return db.source_accounts.findOne({
        where: {
            api_key: query.api_key
        }
    }).then((result) => {
        if (result)
            return true
        else
            res.status(400).send("error api_key")
        return false
    }).catch(error => {
        res.send(error.parent.sqlMessage)
    })


}
module.exports.get_source_accounts_by_api_key = function get_source_accounts_by_api_key(db, api_key, callback) {
    db.source_accounts.findOne({
        where: {
            api_key: api_key
        }
    }).then(function (source_account) {
        callback(source_account)
    }).catch(error => {
        return false
    })

}
module.exports.get_gateway_by_name = function get_gateway_by_name(db, name, callback) {
    db.Gateways.findOne({
        where: {
            name: name
        }
    }).then(function (gateway) {
        callback(gateway)
    }).catch(error => {
        return false
    })
}
module.exports.formatDate = function formatDate(date) {
    let d;
    d = new Date(date)

    if (date === undefined) {
        d = new Date()
    }

    let month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}