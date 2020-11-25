'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class email extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  email.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    emailTo: DataTypes.STRING,
    emailFrom: DataTypes.STRING,
    text: DataTypes.TEXT,
    title: DataTypes.STRING,
    source_account_id: DataTypes.INTEGER,
    gateway_id: DataTypes.INTEGER,
    html: DataTypes.TEXT,
    type: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'email',
  });
  return email;
};