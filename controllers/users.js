// Padrão da importacao do express
const express = require("express");

// rota do express
const router = express.Router();

// importar o arquivo que tem conexão com o banco de dados
const db = require("./../db/models");

// Rota para adicionar um usuário
router.post("/users", async (req, res) => {
  let dados = req.body;

  // salvar no banco de dados
  try {
    const dadosUsuario = await db.Users.create(dados);
    return res.json({
      mensagem: "Usuário cadastrado com sucesso!",
      dadosUsuario,
    });
  } catch (error) {
    return res.status(400).json({
      mensagem: "Erro: e-mail já cadastrado ou digitado incorreto.",
    });
  }
});

// Rota para editar um usuário
router.put("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const novosDados = req.body;

  try {
    const usuario = await db.Users.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado!" });
    }

    await usuario.update(novosDados);

    return res.json({
      mensagem: "Usuário atualizado com sucesso!",
      dadosUsuario: usuario,
    });
  } catch (error) {
    console.error(error); // Adicione esta linha para imprimir o erro no console
    return res.status(500).json({
      mensagem: "Erro: não foi possível atualizar o usuário.",
    });
  }
});

// Rota para deletar um usuário
router.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const usuario = await db.Users.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado!" });
    }

    await usuario.destroy();

    return res.json({ mensagem: "Usuário deletado com sucesso!" });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro: não foi possível deletar o usuário.",
    });
  }
});

// exportar a instrução da router
module.exports = router;
