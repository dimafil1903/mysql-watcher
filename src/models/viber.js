'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class viber extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  viber.init({
    number: DataTypes.STRING,
    type: DataTypes.STRING,
    status: DataTypes.STRING,
    source_account_id: DataTypes.INTEGER,
    text:DataTypes.TEXT,
    gateway_id: DataTypes.INTEGER,
    message_id: DataTypes.INTEGER,
    image: DataTypes.TEXT,
    button_link: DataTypes.TEXT,
    button_text: DataTypes.STRING,
    ttl: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'viber',
  });
  return viber;
};