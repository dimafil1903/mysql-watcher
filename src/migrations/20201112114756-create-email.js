'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('emails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      emailTo: {
        type: Sequelize.STRING
      },
      emailFrom: {
        type: Sequelize.STRING
      },
      text: {
        type: Sequelize.TEXT
      },
      title: {
        type: Sequelize.STRING
      },
      source_account_id: {
        type: Sequelize.INTEGER
      },
      gateway_id: {
        type: Sequelize.INTEGER
      },
      html: {
        type: Sequelize.TEXT
      },
      type: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('emails');
  }
};