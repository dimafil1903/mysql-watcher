'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class sms extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    sms.init({
        number: DataTypes.STRING,
        text: DataTypes.TEXT,
        source_account_id: DataTypes.INTEGER,
        type: DataTypes.STRING,
        status: DataTypes.STRING,
        gateway_id: DataTypes.INTEGER,
        message_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'sms',
    });
    return sms;
};