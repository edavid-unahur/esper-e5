'use strict';
module.exports = (sequelize, DataTypes) => {
  const carrera = sequelize.define('usuario', {
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  
  return carrera;
};