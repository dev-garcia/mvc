// Padrão da importacao do express
const express = require("express");

// rota do express
const router = express.Router();

// importar o arquivo que tem conexão com o banco de dados
const db = require("./../db/models");

router.post("/users", async (req, res) => {
  let dados = req.body;
  console.log(dados);

  // salvar no banco de dados
  await db.Users.create(dados)
    .then((dadosUsuario) => {
      return res.json({
        mensagem: "usuário cadastrado com sucesso!",
        dadosUsuario,
      });
    })
    .catch(() => {
      return res.json({
        mensagem: "Erro: usuário não cadastrado com sucesso!",
      });
    });
});

// exportar a instrução da router
module.exports = router;
