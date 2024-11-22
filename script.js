let acessarClick = document.getElementById("botaoUsuario"); //Seleciona o elemento do HTML e armazena em uma variável

acessarClick.addEventListener('click', (e) => { //Adiciona um evento para o botão selecionado
    e.preventDefault(); //Apenas para manter no console e a mensagem não sumir
    console.log("O click deu certo"); //Exibe no console toda vez que o botão for clicado
})