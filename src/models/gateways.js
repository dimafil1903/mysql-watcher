const crypto = require('crypto');
let api_key = require('../config/api_keys');

const algorithm = 'aes-256-cbc';
const key = api_key()[0]
const iv = crypto.randomBytes(16);

function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}



'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Gateways extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    Gateways.init({
        name: DataTypes.STRING,
        type: DataTypes.STRING,
        api_name: DataTypes.STRING,
        auth: {
            type: DataTypes.TEXT,
            get: function () {
                let res;
                try {
                    res = JSON.parse(decrypt(JSON.parse(this.getDataValue('auth'))))
                } catch (e) {
                    return false;

                }
                return res;
            },
            set: function (value) {
                let res;
                let enc
                try {
                    enc=  JSON.stringify(encrypt(JSON.stringify(JSON.parse(value))))
                    res =  this.setDataValue('auth', enc)
                } catch (e) {
                    return false;

                }
                return res;
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at',
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at',
        },
    }, {
        sequelize,
        timestamps: true,
        modelName: 'Gateways',
    });
    return Gateways;
};