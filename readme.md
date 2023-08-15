Para criar a tabela após clonar o projeto instalar com:

npx sequelize-cli db:migrate

\* \* \* \* \* \* \* \* \* \* \* \* \* \* PASSOS QUE SEGUI PARA A APLICAÇÃO MVC

# forçei a criação do package.json

npm init -y

# instalei o express = https://expressjs.com/pt-br/

npm install express --save

configurei o arquivo "app.js" com a configuração padrão do express, mas configurei para usar a porta 8080

# instalei o nodemon = https://www.npmjs.com/package/nodemon

npm install --save-dev nodemon

com o servidor rodando segui para o próximo passo:

---

# Criando o diretório controller

Criei uma pasta dentro da pasta raíz, nomeada de "controllers", o nome não interfere em nada...

Criei o arquivo "users.js" dentro da pasta "controllers", o nome também não interfere em nada...

---

# Configurando o thunder

Em Header adicionamos os valores: "Content-Type" em header e "application/json" em valor

---

# Criando a base de dados MySQL usando o workbench

Usamos o comando:
CREATE DATABASE name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

Pedi para a IA Bard explicar o comando:

CREATE DATABASE é uma instrução que cria um novo banco de dados.
name é o nome do banco de dados a ser criado e pode ser alterado.
CHARACTER SET utf8mb4 é o conjunto de caracteres a ser usado para o banco de dados.
COLLATE utf8mb4_unicode_ci é a ordenação a ser usada para o banco de dados.

# instalei o sequelize = https://sequelize.org/docs/v6/getting-started/

1 - npm install --save sequelize

# Instalei o driver para o banco de dados

1 - npm install --save mysql2

# Instalei o sequelize-cli para usar o migrations = https://sequelize.org/docs/v6/other-topics/migrations/

1 - npm install --save-dev sequelize-cli

Criamos os arquivos models, migrations e seeders com o comando init

2 - npx sequelize-cli init

criei o arquivo na pasta raíz conforme a documentação recomenda, está quase no final da página da documentação com o nome de ".sequelizerc"

criado os arquivos, movi todas as pastas para uma pasta nomeada de "db" o nome não interfere em nada, mas é preciso configurar o diretório caso altere ou escolha outro nome

documentei as alterações realizadas no código padrão da documentação dentro do arquivo ".sequelizerc".

# Instalando a variável de ambiente Dotenv = https://www.npmjs.com/package/dotenv e https://www.geeksforgeeks.org/what-is-node_env-in-node-js/

npm install dotenv --save

crio um arquivo ".env" na raíz do projeto como recomenda a documentação

configuro o arquivo como no vídeo: https://www.youtube.com/watch?v=e8e-ZfUNvSQ&list=PLmY5AEiqDWwDZ4q3MK6tZ3-bCB4dpP4d9&index=17&ab_channel=Celke

---

# Testando a conexão com o banco de dados

Vamos em "app.js"

adicionamos:

// Testar conexão com o banco de dados
const db = require("./db/models")

vamos no arquivo "Index.js" localizado em "models" e adicionamos o código:

// verificar a conexão com o banco de dados

try {
console.log("Conexão com o banco de dados conectado com sucesso!");
} catch (error) {
console.log("Erro: servidor não conectou com o banco de dados!", error);
}

de preferência dar reload no vs

rodamos o nodemon e testamos a rota post, com tudo funcionando vamos criar as tabelas

---

# Criando as tabelas MySQL com migrations

npx sequelize-cli model:generate --name Users --attributes nome_usuario:string,email_usuario:string,senha_usuario:string,telefone_usuario:number

após criar os arquivos, alterei em migrations no arquivo criado para ter algumas melhorias, como:

--- adicionei "unique: true," em "email_usuario", para não poder ter o mesmo email em mais de um usuário.
--- adicionei " name: "data_usuario_criado" " e " name: "data_usuario_editado" " para alterar o nome das colunas "updatedAt" e "createdAt"
--- adicionei o:
usuario_ativo: {
type: Sequelize.BOOLEAN,
default: true,
},

para sabermos se o usuário esta com o cadastro ativo ou desativado, podendo gerar relatórios para a empresa.

Depois usamos o comando:

npx sequelize-cli db:migrate

# Erros

Algumas melhorias que tentei adicionar fracassaram, dentro delas:

As tabelas de data da criação e edição do usuário não salvaram o nome em português como eu coloquei acima;
Esqueci de alterar o id para id_usuario para manter o padrão de escritas.

# teste

Após a criação das tabelas com migration e os erros que mencionei acima, vou testar a aplicação, em "app.js" vou adicionar:

// receber os dados no terminal
let dados = req.body;
console.log(dados);

dentro da rota post:
// rota de cadastro
router.post("/users", async (req, res) => {

    // receber os dados no terminal

let dados = req.body;
console.log(dados);

Fica assim.

no thunder ou qualquer outro software vamos enviar os dados json em post:
{
"nome_usuario": "teste01",
"email_usuario": "teste01@gmail.com",
"senha_usuario": "teste01",
"telefone_usuario": "92 1234-5678"
}

retornou status 200 ok e:

{
"mensagem": "usuario cadastrado com sucesso"
}

mas não enviou para o banco de dados...

# Configurando para a aplicação receber json

em "app.js"

adiciono o:

app.use(express.json());

expliquei o que acontece com comentários no arquivo.

# Incluir conexão com o banco de dados

em "users.js" da pasta "controllers", adicionamos acima da rota post:

// arquivo que contém a conexão com o banco de dados
const db = require("./../db/models");

após as adições no código está rodando e salvando no banco de dados!

# erros até o momento

a opção de "usuario_ativo" não está funcionando como deveria, está ficando com valor "null" na tabela.

Tentei realizar alterações com o

npx sequelize-cli db:migrate:undo // desfaz a migração

npx sequelize-cli db:migrate // realizar a migração novamente após alterar o arquivo

# Adicionando rota para listar os cadastros

adicionada a rota get em "users.js" do diretório "controllers"

Para instruir quais colunas devem ser listadas, adicionamos o código dentro da rota get e após findAll no diretório "controllers":

// informar quais colunas devem ser listadas

attributes: ["id", "nome_usuario", "email_usuario", "telefone_usuario"],

# RESOLVIDO O ERRO DE USUARIO ATIVO

Sem querer em outra pesquisa descobri que alterando o valor de "default: true" para "defaultValue: true," o problema na tabela seria corrigido, e
com isso também descobri que na tabela 1 é igual a true e 0 é igual a false, mesmo que eu tente usar esses valores booleanos não vai ser possível
pq mesmo alterando por código eles serão convertidos em 0 e 1.

## Gerar token para armazenar no front = https://www.npmjs.com/package/jsonwebtoken?activeTab=versions

npm install jsonwebtoken
