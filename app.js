const express = require("express"); // doc = https://expressjs.com/pt-br/starter/hello-world.html
const cors = require("cors");
const path = require("path"); // Importe o módulo path
const app = express();

// Configurar o servidor para servir os arquivos estáticos do front-end e da pasta "public"
const interfacePath = path.join(__dirname, "interface");
const publicPath = path.join(__dirname, "interface", "public");
app.use(express.static(interfacePath));
app.use(express.static(publicPath));

// Permitir a requisação do front sem ter problemas com o cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(cors());

app.use(express.json()); // instruindo usar o express e que pode receber os dados em formato de objeto json.

// incluindo a "controller"
const users = require("./controllers/users");

// usando as rotas criadas
app.use("/", users);

// Rota de fallback para lidar com o redirecionamento do frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(interfacePath, "src", "app", "home", "index.html"));
});

// servidor express rodando na porta 8080
app.listen(8080, () => {
  console.log("servidor rodando na porta 8080: http://localhost:8080");
});
