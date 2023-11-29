const { DataTypes, Sequelize } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
  const posts = Sequelize.define("posts", {
    postText: {
      type: DataTypes.STRING,
    },
    postPictures: {
      type: DataTypes.STRING,
    },

    profilePicture: {
      type: DataTypes.STRING,
    },

    userName: {
      type: DataTypes.STRING,
    },
  });

  posts.associate = (models) => {
    posts.hasMany(models.comments, {
      onDelete: "cascade",
    });

    posts.hasMany(models.likes, {
      onDelete: "cascade",
    });
  };

  return posts;
};
