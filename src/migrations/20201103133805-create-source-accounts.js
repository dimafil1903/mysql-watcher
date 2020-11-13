'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('source_accounts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            api_key: {
                type: Sequelize.TEXT
            },
            email:{
                type: Sequelize.STRING
            },
            webhook_url: {
                type: Sequelize.STRING
            },
            default_type: {
                type: Sequelize.STRING
            },
            default_gateway_id: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('now')

            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('now')

            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('source_accounts');
    }
};