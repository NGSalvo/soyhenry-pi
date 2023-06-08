const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('weight', {
      id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         primaryKey: true,
      },
      min: {
         type: DataTypes.FLOAT,
         allowNull: false
      },
      max: {
         type: DataTypes.FLOAT,
         allowNull: false
      }
  });
};
