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
        foreignKey: "userId", // Specify the foreign key to link User and Character
        as: "user", // Set an alias for the association
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
      realm: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      playableClass: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      playableRace: {
        type: DataTypes.STRING,
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
