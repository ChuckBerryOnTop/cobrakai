module.exports = (sequelize, DataTypes) => {
    let Classify = sequelize.define("Classify", {
     name: {
        type: DataTypes.STRING(120), 
        allowNull: false,
        // validate: {
        //   len: [1]
        // }
      },

      summary: {
        type: DataTypes.TEXT, 
        allowNull: false,
      },

      labels: {
        type: DataTypes.TEXT, 
        allowNull: false,
      },

      text: {
        type: DataTypes.TEXT, 
        allowNull: true,
      },

      file: {
        type: DataTypes.STRING(120), 
        allowNull: false,
      }
      // image: {
      //   type: DataTypes.BLOB("long")//,
      //   // allowNull: false,
      //   // validate: {
      //   //   len: [1]
      //   // }
      // }
    });
    return Classify;
  };