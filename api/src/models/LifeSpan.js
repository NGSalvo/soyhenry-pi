const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('lifeSpan', {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      min: {
         type: DataTypes.INTEGER,
         allowNull: false
      },
      max: {
         type: DataTypes.INTEGER,
         allowNull: false
      }
  },{ underscored: true });
};
