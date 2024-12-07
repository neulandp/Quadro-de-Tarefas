document.addEventListener("DOMContentLoaded", () => { //Função será executado quando a página HTML carregar totalmente
    const mensagem = document.getElementById("saudacao-usuario"); //Armazena o ID do elemento HTML em uma variável

    let nomeUsuario = localStorage.getItem("usuario"); //Recupera o item "usuario" armazenado no localStorage
    if(nomeUsuario){ //Verifica se o item "usuario" foi encontrado no localStorage, se for verdadeiro, executa o bloco de código abaixo
        try{ 
            let nome = JSON.parse(nomeUsuario); //Converte a string JSON de volta para objeto
            let primeiroNome = nome.Name.split(" ")[0]; //Pega o primeiro nome, divide a string "Name" no espaço e pega a primeira palavra
            mensagem.innerText = `Olá, ${primeiroNome}`; //Exibe uma mensagem personalizada com o nome do usuário que logar
        }catch(error){ //Se ocorrer algum erro ao tentar processar dados, executa o bloco de código abaixo
            console.error("Erro ao acessar ou processar dados do usuário:", error); //Exibe essa mensagem
        }
    }else{ //Se não for verdadeiro, executa o bloco de código abaixo
        mensagem.innerText = "Bem-vindo, visitante"; //Se não houver nenhum dado do usuário no localStorage, exibe a mensagem
    }
});

