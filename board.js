document.addEventListener("DOMContentLoaded", () => {
    const mensagem = document.getElementById("saudacao-usuario");

    let nomeUsuario = localStorage.getItem("usuario");
    if (nomeUsuario) {
        try {
            let nome = JSON.parse(nomeUsuario);
            let primeiroNome = nome.Name.split(" ")[0];
            mensagem.innerText = `Olá, ${primeiroNome}`;
        } catch (error) {
            console.error("Erro ao acessar ou processar dados do usuário:", error);
        }
    } else {
        mensagem.innerText = "Bem-vindo, visitante";
    }

    // Chama a função para carregar as boards
    selecionarBoard();
});

