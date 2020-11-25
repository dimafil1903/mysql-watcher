'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('sms', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true
            },
            number: {
                type: Sequelize.STRING
            },
            text: {
                type: Sequelize.TEXT
            },
            type: {
                type: Sequelize.STRING
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
            priority: {
                type: Sequelize.INTEGER
            },
            system_type: {
                type: Sequelize.STRING
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
        await queryInterface.dropTable('sms');
    }
};