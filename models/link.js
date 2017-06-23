'use strict';
module.exports = function(sequelize, DataTypes) {
  var Link = sequelize.define('Link', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      descr: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      clicks: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Link;
};