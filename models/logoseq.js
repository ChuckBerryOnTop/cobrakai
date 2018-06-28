module.exports = (sequelize, DataTypes) => {
    let ImgAdd = sequelize.define("ImgAdd", {
    //  name: {
    //     type: DataTypes.STRING(120), 
    //     allowNull: false,
    //     validate: {
    //       len: [1]
    //     }
      // },
      image: {
        type: DataTypes.BLOB("long")//,
        // allowNull: false,
        // validate: {
        //   len: [1]
        // }
      }
    });
    return ImgAdd;
  };