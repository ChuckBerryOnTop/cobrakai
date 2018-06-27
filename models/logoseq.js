module.exports = function(sequelize, DataTypes) {
    var Logo = sequelize.define("Logo", {
     name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
    });
    return Post;
  };