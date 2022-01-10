"use strict";

module.exports = (sequelize, DataTypes) => {
  const shops = sequelize.define(
    "shops",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      domain: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "shops",
    }
  );

  return shops;
};
