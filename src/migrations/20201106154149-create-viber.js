'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vibers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      number: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      text: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.STRING
      },
      source_account_id: {
        type: Sequelize.INTEGER
      },
      gateway_id: {
        type: Sequelize.INTEGER
      },
      message_id: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.TEXT
      },
      button_link: {
        type: Sequelize.TEXT
      },
      button_text: {
        type: Sequelize.STRING
      },
      ttl: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('vibers');
  }
};