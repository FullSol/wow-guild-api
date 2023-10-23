"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Guild extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Character, {
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
      });
      this.belongsTo(models.User, {
        as: "GuildMaster",
        foreignKey: "guildMasterUserId",
        onDelete: "RESTRICT",
        onUpdate: "NO ACTION",
      });
    }
  }
  Guild.init(
    {
      bnetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      guildMasterUserId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Guild",
    }
  );
  return Guild;
};
