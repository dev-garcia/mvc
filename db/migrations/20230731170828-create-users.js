"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nome_usuario: {
        type: Sequelize.STRING,
      },
      email_usuario: {
        type: Sequelize.STRING,
        unique: true,
      },
      senha_usuario: {
        type: Sequelize.STRING,
      },
      telefone_usuario: {
        type: Sequelize.STRING,
      },
      usuario_ativo: {
        type: Sequelize.BOOLEAN,
        default: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        // Nome da coluna alterado
        name: "data_usuario_criado",
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        // Nome da coluna alterado
        name: "data_usuario_editado",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
