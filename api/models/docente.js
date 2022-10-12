'use strict';
module.exports = (sequelize, DataTypes) => {
  const docente = sequelize.define('docente', {
    nombre: DataTypes.STRING,
    id_materia: DataTypes.INTEGER
  }, {});
  docente.associate = function(models) {

    //asociacion a carrera (pertenece a:)
    docente.belongsTo(models.materia// modelo al que pertenece
    ,{
      as : 'Materia-Relacionada',  // nombre de mi relacion
      foreignKey: 'id_materia'     // campo con el que voy a igualar
    })
  	/////////////////////
  };

  return docente;
};