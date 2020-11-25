
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
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        number: DataTypes.STRING,
        text: DataTypes.TEXT,
        priority:DataTypes.INTEGER,
        system_type:DataTypes.STRING,
        source_account_id: DataTypes.INTEGER,
        type: DataTypes.STRING,
        status: DataTypes.STRING,
        gateway_id: DataTypes.INTEGER,
        message_id: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'sms',
    });

    return sms;
};