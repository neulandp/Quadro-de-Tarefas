/*Mensagem de boas-vindas*/
document.addEventListener("DOMContentLoaded", () => {
    const mensagem = document.getElementById("saudacao-usuario");

    let nomeUsuario = localStorage.getItem("usuario");
    if (nomeUsuario) {
        try {
            let nome = JSON.parse(nomeUsuario);
            let primeiroNome = nome.Name.split(" ")[0];
            mensagem.innerText = `Olá, ${primeiroNome}`;
        } catch (erro) {
            console.error("Erro ao acessar ou processar dados do usuário:", erro);
        }
    } else {
        mensagem.innerText = "Bem-vindo, visitante";
    }

    //Chama a função para carregar os quadros
    dropdown();
});

const url_tema = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/";
const url_colunas = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/ColumnByBoardId?BoardId";
const url_quadro = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Boards";
const url_tarefa = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/TasksByColumnId?ColumnId";

//Evento para mostrar o modo escuro
const botaoEscuro = document.getElementById("button-darkmode");
botaoEscuro.addEventListener('change', () => {
    if (botaoEscuro.checked) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});

//DropDown
async function dropdown() {
    try {
        const listaQuadros = await fetch(url_quadro);  //Fazendo a requisição para obter os quadros
       
        if (listaQuadros.ok) {
            const boardsDropdown = document.getElementById("boardsDropdown");
            const quadros = await listaQuadros.json();  //Convertendo a resposta para JSON
            criarQuadro(quadros, boardsDropdown);
        } else {
            console.error("Erro", listaQuadros.status); //Exibe a mensagem de erro
        }
    } catch (erro) {
        console.log("Erro", erro); //Exibe a mensagem de erro
    }
}

function criarQuadro(quadros, boardsDropdown) {
    quadros.forEach(quadro => {
        const opcaoQuadro = document.createElement("option");
        opcaoQuadro.value = quadro.Id; //ID do quadro
        opcaoQuadro.textContent = quadro.Name; //Nome do quadro
        boardsDropdown.appendChild(opcaoQuadro);    
    });
    
    boardsDropdown.addEventListener("change", async (evento) => {
        const idQuadroSelecionado = evento.target.value; //ID do quadro selecionado
        if (idQuadroSelecionado) {
            await carregarQuadro(idQuadroSelecionado); //Carregar as colunas apenas para o quadro selecionado
        }
    });
}

// EVENTO COLUNAS
async function carregarQuadro(idQuadro) {
    try {
        const containerColunas = document.getElementById("detalhes-board");
        const infoColunas = await fetch(`${url_colunas}=${idQuadro}`);  //Fazendo a requisição para obter as colunas
       
        containerColunas.innerHTML = ""; //Limpa as colunas anteriores
        if (infoColunas.ok) {
            const colunas = await infoColunas.json();
            
            criarColunas(colunas, containerColunas);
        } else {
            console.error("Erro ao carregar colunas:", infoColunas.status);
        }
    } catch (erro) {
        console.log("Erro", erro); //Exibe a mensagem de erro
    }
}

function criarColunas(colunas, containerColunas) {
    colunas.forEach((coluna) => {
        const tarefaColuna = document.createElement("div");
        tarefaColuna.className = "column";  //Adiciona uma classe para estilização
        tarefaColuna.Id = coluna.Id;
        tarefaColuna.innerHTML = `
            <div class="tasks-container" id="tasks-${coluna.Id}">
                <h3>${coluna.Name}</h3>
                <!-- Tarefas desta coluna serão adicionadas aqui -->
            </div>`;
        //Adicionando a coluna ao contêiner principal
        containerColunas.appendChild(tarefaColuna);
        carregarTarefaColuna(coluna.Id);
    });
}

//Tarefas
async function carregarTarefaColuna(idColuna) {
    try {
        const infoTarefa = await fetch(`${url_tarefa}=${idColuna}`);
        const divTarefa = document.getElementById(`tasks-${idColuna}`);
        
        if (infoTarefa.ok) {
            const tarefasJson = await infoTarefa.json();
            criarTarefa(tarefasJson, divTarefa);
        } else {
            console.error("Erro ao carregar tarefas:", infoTarefa.status);
        }
    } catch (erro) {
        console.error("Erro", erro); //Exibe a mensagem de erro
    }
}

//Criar tarefas
function criarTarefa(tarefasJson, divTarefa) {
    //Limpa tarefas anteriores na coluna
    divTarefa.innerHTML = "";

    //Renderiza as tarefas recebidas
    tarefasJson.forEach((tarefa) => {
        const tarefaElemento = document.createElement("div");
        tarefaElemento.className = "task";
        tarefaElemento.innerHTML = `
            <p><strong>${tarefa.Title}</strong></p>
            <p>${tarefa.Description}</p>`;
        divTarefa.appendChild(tarefaElemento);
    });
}
