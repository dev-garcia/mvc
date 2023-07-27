// Padrão Express
const express = require("express");
const app = express();

// para podermos enviar os dados em formato json no thunder
app.use(express.json());

// Testar conexão com o banco de dados
// const db = require("./db/models");

// Inclusao dos controles
const users = require("./controllers/users");

// Criar as rotas
app.use("/", users);

// Rota do servidor
app.listen(8080, () => {
  console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});
