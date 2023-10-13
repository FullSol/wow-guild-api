"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User);
    }
  }
  Profile.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      about: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      bnetHandle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      twitterHandle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      facebookHandle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      discordHandle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      youtubeHandle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Profile",
    }
  );
  return Profile;
};
