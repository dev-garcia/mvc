document.addEventListener("DOMContentLoaded", function () {
  // Variável para armazenar o usuário logado (simulando autenticação)
  let loggedUser = null;

  // Formulário de Cadastro
  const cadastroForm = document.getElementById("cadastroForm");
  cadastroForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;

    try {
      const response = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          phone: phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensagem);
      }

      const data = await response.json();
      console.log("Usuário cadastrado com sucesso!", data);
      showLoginForm();
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error.message);
    }
  });

  // Formulário de Login
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensagem);
      }

      const data = await response.json();
      console.log("Usuário logado com sucesso!", data);
      loggedUser = data.dadosUsuario;
      showRestrictedArea(loggedUser);
    } catch (error) {
      console.error("Erro ao fazer login:", error.message);
    }
  });

  // Botão Sair (Logout)
  const logoutButton = document.getElementById("logoutButton");
  logoutButton.addEventListener("click", function () {
    // Fazer o logout do usuário
    loggedUser = null;
    showLoginForm();
  });

  // Função para exibir o formulário de login e ocultar os demais conteúdos
  function showLoginForm() {
    document.getElementById("signup-form").style.display = "block";
    document.getElementById("login-form").style.display = "none";
    document.getElementById("restricted-area").style.display = "none";
  }

  // Função para exibir a área restrita e ocultar os demais conteúdos
  function showRestrictedArea(user) {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "none";
    document.getElementById("restricted-area").style.display = "block";
    document.getElementById("userName").textContent = user.name;
    document.getElementById("userImage").src = user.image;
  }
});
