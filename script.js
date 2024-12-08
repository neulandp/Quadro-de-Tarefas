let textoErro = document.getElementById("message-error"); //Seleciona o elemento do HTML especificado e armazena em uma variável

const url_api = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard"; //Armazena a URL em uma variável

let botaoAcessar = document.getElementById("botaoUsuario"); //Seleciona o elemento do HTML e armazena em uma variável

botaoAcessar.addEventListener('click', async (evento) => { //Adiciona um evento para o botão selecionado
    evento.preventDefault(); //Previne o comportamento padrão do evento (por exemplo, evitando que a página seja recarregada)
    let valorEmail = document.getElementById("userEmail").value; //Pega o valor atual do campo de entrada e armazena em uma variável
    document.getElementById("userEmail").value = ""; //Tira o valor toda vez que clica no botão

    try { //Envolve o código que pode lançar um erro, se ocorre um erro dentro do try, ele será capturado no catch
        let respostaEmail = await fetch(`${url_api}/GetPersonByEmail?Email=${valorEmail}`); //Fetch mas a requisição para a URL fornecida, awai aguarda a resposta e isso é armazenado em uma variável
        if(respostaEmail.ok){ //"ok" verifica se a requisição deu certo, se for verdadeiro, será executado
            let informacoesUsuario = await respostaEmail.json(); //Converte para JSON e o await é usado para aguardar a resposta, sendo armazenado em uma variável
            localStorage.setItem("usuario", JSON.stringify({Nome: informacoesUsuario.Name, Id: informacoesUsuario.Id,})); //Armazena o item no localStorage e converte o objeto para uma string JSON
            window.location.href = "./taskBoard.html"; //Redireciona para uma nova página
        }else{ //Se a requisição não for verdadeira, será executado
            textoErro.innerText = "E-mail não encontrado!"; //Altera o texto exibido na tela
            textoErro.style.display = "block"; //Torna a mensagem de erro visível
        }
    } catch(erro) { //Captura qualquer erro que tenha ocorrido dentro do try
        textoErro.innerText = "Erro inesperado!"; //Exibe a mensagem de erro, indicando que houve uma falha
        textoErro.style.display = "block"; //Torna a mensagem visível
    }
})