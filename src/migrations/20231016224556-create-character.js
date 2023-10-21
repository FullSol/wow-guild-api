"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Characters",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userId: {
          type: Sequelize.UUID,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
          references: {
            model: "Users",
            key: "id",
          },
        },
        bnetId: {
          unique: true,
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        realm: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        playableClassId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "PlayableClasses",
            key: "id",
          },
        },
        playableRaceId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "PlayableRaces",
            key: "id",
          },
        },
        gender: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        faction: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        level: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        guildId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "Guilds",
            key: "id",
          },
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        uniqueKeys: {
          Characters_unique: {
            fields: ["name", "realm"],
          },
        },
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Characters");
  },
};
