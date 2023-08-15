const express = require("express");
// usando as rotas do express = https://expressjs.com/pt-br/guide/routing.html ou https://expressjs.com/pt-br/4x/api.html#router
const router = express.Router();

// arquivo que contém a conexão com o banco de dados
const db = require("./../db/models");

const path = require("path");

// Adicione esse middleware para que o req.body seja preenchido corretamente com os dados do formulário
router.use(express.urlencoded({ extended: true }));

router.get("/cadastro", (req, res) => {
  res.sendFile(
    path.join(__dirname, "./../../interface/src/app/cadastro/index.html")
  );
});

// Rota para a página home após o login
router.get("/home", (req, res) => {
  res.sendFile(
    path.join(__dirname, "./../../interface/src/app/home/index.html")
  );
});

router.post("/cadastro", async (req, res) => {
  let dados = req.body;
  console.log(dados);

  await db.Users.create(dados)
    .then((dadosUsuario) => {
      return res.json({
        mensagem: "Usuário cadastrado com sucesso",
        dadosUsuario,
      });
    })
    .catch(() => {
      return res.json({
        mensagem: "Erro: usuário não cadastrado com sucesso",
      });
    });
});

router.get("/users", async (req, res) => {
  // estamos usando a model Users e buscando os registros usando o findAll
  const users = await db.Users.findAll({
    // ordenar os registros de forma decrescente pela coluna id
    order: [["id", "DESC"]],
  });

  // retornando os dados da tabela users
  if (users) {
    return res.json({
      users,
    });
  } else {
    // se nao conseguir retornar os dados da tabela users, retorna erro 400 e a mensagem de erro
    return res.status(400).json({
      mensagem: "Erro: dados não encontrados!",
    });
  }
});

// rota de cadastro
router.post("/users", async (req, res) => {
  // receber os dados no terminal
  let dados = req.body;
  console.log(dados);

  // salvar no banco de dados
  await db.Users.create(dados)
    .then((dadosUsuario) => {
      return res.json({
        mensagem: "usuario cadastrado com sucesso",
        dadosUsuario,
      });
    })
    .catch(() => {
      return res.json({
        mensagem: "Erro: usuario não cadastrado com sucesso",
      });
    });
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

const jwt = require("jsonwebtoken");
const SECRET_KEY = "resid"; // Substitua pela sua chave secreta

// Rota de login
router.post("/login", async (req, res) => {
  const { email_usuario, senha_usuario } = req.body;

  try {
    // Consultar o banco de dados para verificar se o usuário existe
    // e se a senha está correta

    // Exemplo de código (não seguro, apenas para fins de ilustração):
    const usuario = await db.Users.findOne({
      where: {
        email_usuario,
        senha_usuario,
      },
    });

    if (usuario) {
      // Usuário encontrado e senha correta

      // Gere o token de autenticação
      const token = jwt.sign({ email: usuario.email_usuario }, SECRET_KEY);

      // Retorne o token na resposta
      return res.status(200).json({ token });
    } else {
      // Usuário não encontrado ou senha incorreta
      return res.status(401).json({ mensagem: "Credenciais inválidas!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: "Erro ao fazer login!" });
  }
});

// Rota para verificar o login
router.post("/verificar-login", async (req, res) => {
  const { token } = req.body;

  try {
    // Verificar o token usando a biblioteca jsonwebtoken
    const decoded = jwt.verify(token, "resid");

    // Decodifica o token e recupera os dados do usuário
    const { email } = decoded;

    // Consultar o banco de dados para obter os dados do usuário
    // Exemplo de código (não seguro, apenas para fins de ilustração):
    const usuario = await db.Users.findOne({
      where: {
        email_usuario: email,
      },
    });

    if (usuario) {
      // Se o usuário for encontrado, retorne os dados do usuário em formato JSON
      return res.status(200).json({
        nome_usuario: usuario.nome_usuario,
      });
    } else {
      // Se o usuário não for encontrado, retorne um erro 404
      return res.status(404).json({
        mensagem: "Usuário não encontrado!",
      });
    }
  } catch (error) {
    console.error(error);
    // Se houver um erro ao verificar o token, retorne um erro 401
    return res.status(401).json({
      mensagem: "Token inválido!",
    });
  }
});

// Rota para a página de edição do perfil
router.get("/editar-perfil", (req, res) => {
  res.sendFile(
    path.join(__dirname, "./../../interface/src/app/editar-perfil/index.html")
  );
});

// Rota para editar o perfil do usuário
router.put("/editar-perfil", async (req, res) => {
  const { nome_usuario, senha_usuario, telefone_usuario, token } = req.body;

  try {
    // Verificar o token usando a biblioteca jsonwebtoken
    const decoded = jwt.verify(token, SECRET_KEY);

    // Decodifica o token e recupera os dados do usuário
    const { email } = decoded;

    // Consultar o banco de dados para obter os dados do usuário
    const usuario = await db.Users.findOne({
      where: {
        email_usuario: email,
      },
    });

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado!" });
    }

    // Atualize os dados do usuário com os novos dados recebidos na requisição
    usuario.nome_usuario = nome_usuario;
    usuario.senha_usuario = senha_usuario;
    usuario.telefone_usuario = telefone_usuario;

    // Salve as alterações no banco de dados
    await usuario.save();

    return res.json({ mensagem: "Perfil atualizado com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ mensagem: "Token inválido!" });
  }
});

// ...

router.get("/users", async (req, res) => {
  try {
    const users = await db.Users.findAll({
      attributes: ["id", "nome_usuario", "email_usuario", "telefone_usuario"],
      order: [["id", "DESC"]],
    });

    return res.json({
      users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      mensagem: "Erro ao buscar usuários.",
    });
  }
});

// ...

// exportando as rotas
module.exports = router;
