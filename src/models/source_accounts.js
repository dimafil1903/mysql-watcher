'use strict';
let hat=require("hat")
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class source_accounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  source_accounts.init({
    name: {
      allowNull:false,
      type:DataTypes.STRING
    },
    api_key: {

      type:DataTypes.TEXT
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    webhook_url: {
      allowNull: true,
      type: DataTypes.STRING
    },
    default_type: DataTypes.STRING,
    default_gateway_id: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'source_accounts',
    hooks: {
      beforeCreate: function (source_accounts, options) {
        source_accounts.api_key = hat()
      },
    }
  });
  return source_accounts;
};