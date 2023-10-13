"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Profiles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: "Users", // name of Target model
          key: "id", // key in Target model that we're referencing
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      about: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      bnetHandle: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      twitterHandle: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      facebookHandle: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      discordHandle: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      youtubeHandle: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Profiles");
  },
};
