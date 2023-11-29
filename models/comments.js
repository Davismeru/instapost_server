const { DataTypes, Sequelize } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
  const comments = Sequelize.define("comments", {
    comments: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    profilePicture: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return comments;
};
