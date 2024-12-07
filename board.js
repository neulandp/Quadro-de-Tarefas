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

const url_api = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Boards";

async function selecionarBoard() {
    try {
        const listaBoards = await fetch(`${url_api}/Boards`);

        if (listaBoards.ok) {
            const listaSelecaoBoards = document.getElementById("boardsLista");
            const boardsList = await listaBoards.json();  // Corrigido aqui

            boardsList.forEach(board => {
                const opcao = document.createElement("li");
                opcao.value = board.Id;
                opcao.textContent = board.Name;
                opcao.className = "dropdown-item"; // Retirei o id duplicado
                opcao.addEventListener("click", (event) => {
                    loadBoard(board.Id);
                });
                listaSelecaoBoards.appendChild(opcao);
            });
        } else {
            console.error("Falha ao obter as boards: ", listaBoards.statusText);
        }
    } catch (error) {
        console.error("Erro ao fazer a requisição:", error);
    }
}

const url_quadros = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/ColumnByBoardId?BoardId";

async function loadBoard(boardId) {
    try {
        const selectElement = document.getElementById("select-board");
        const boardTitle = document.getElementById("board-title");

        const infoColumns = await fetch(`${url_quadros}=${boardId}`);

        if (infoColumns.ok) {
            const column = await infoColumns.json();
            boardTitle.innerHTML = column.BoardId;
        } else {
            console.error("Erro", infoColumns.status);
        }
    } catch (error) {
        console.error("Erro", error.message);
    }
}

document.getElementById("boardsDropdown").addEventListener("click", async (event) => {
    const coluna = document.getElementsByClassName("column-item");

    for (let colum of coluna) {
        console.log(colum);
    }
});
