"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Character extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      this.belongsTo(models.Guild, {
        foreignKey: "guildId",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });
      this.belongsTo(models.PlayableRace, {
        foreignKey: "playableRaceId",
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      });
      this.belongsTo(models.PlayableClass, {
        foreignKey: "playableClassId",
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      });
    }
  }
  Character.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      bnetId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      playableClassId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      playableRaceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      faction: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      realmId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      guildId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Character",
      indexes: [
        {
          fields: ["name", "realm"],
        },
      ],
    }
  );
  return Character;
};
