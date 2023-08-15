"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init(
    {
      nome_usuario: DataTypes.STRING,
      email_usuario: DataTypes.STRING,
      senha_usuario: DataTypes.STRING,
      telefone_usuario: DataTypes.NUMBER,
      usuario_ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
