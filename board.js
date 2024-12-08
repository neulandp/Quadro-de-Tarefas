const url_tema = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/"
const url_quadros = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/ColumnByBoardId?BoardId"
const url_quadro = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Boards"
const url_tarefa = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/TasksByColumnId?ColumnId"

// EVENTO QUE ATIVA O MODO ESCURO
const botaoModoEscuro = document.getElementById("botao-modo-escuro");
botaoModoEscuro.addEventListener('change', () => {
  if (botaoModoEscuro.checked) {
    document.body.classList.add('modo-escuro');
  } else {
    document.body.classList.remove('modo-escuro');
  }
});

// DROPDOWN
async function carregarQuadros() {
    try {
        const listaQuadros = await fetch(url_quadro);  // Fazendo a requisição para obter os quadros
        
        if (listaQuadros.ok) {
            const selectQuadro = document.getElementById("selecao-quadro-tarefa");
            const quadros = await listaQuadros.json(); // Convertendo a resposta para JSON
            criarQuadros(quadros, selectQuadro);
        } else {
            console.error("Erro", listaQuadros.status); // Exibe a mensagem de erro
        }
    } catch (erro) {
        console.log("Erro"); // Exibe a mensagem de erro
    }
}

function criarQuadros(quadros, selectQuadro) {
    quadros.forEach(quadro => {
        const opcaoQuadro = document.createElement("option");
        opcaoQuadro.value = quadro.Id; // ID do quadro
        opcaoQuadro.textContent = quadro.Name; // Nome do quadro
        selectQuadro.appendChild(opcaoQuadro);    
    });
    selectQuadro.addEventListener("change", async (evento) => {
        const idQuadroSelecionado = evento.target.value; // ID do quadro selecionado
        if (idQuadroSelecionado) {
            await carregarColunas(idQuadroSelecionado); // Carregar as colunas apenas para o quadro selecionado
        }        
    });
}

document.addEventListener("DOMContentLoaded", carregarQuadros);

// EVENTO COLUNAS
async function carregarColunas(idQuadro) {
    try {
        const containerColunas = document.getElementById("container-colunas");
        const tituloQuadro = document.getElementById("titulo-quadro");
        const infoColunas = await fetch(`${url_quadros}=${idQuadro}`);  // Fazendo a requisição para obter as colunas
        
        containerColunas.innerHTML = ""; // Limpa as colunas anteriores
        if (infoColunas.ok) {
            const colunas = await infoColunas.json();
            
            // Atualizar o título do quadro, se necessário - Supondo que a API retorne o nome do quadro
            criarColunas(colunas, containerColunas);
        } else {
            console.error("Erro ao carregar colunas:", infoColunas.status);
        }
    } catch (erro) {
        console.log("Erro"); // Exibe a mensagem de erro
    }
}

function criarColunas(colunas, containerColunas) {
    colunas.forEach((coluna) => {
        const colunaTarefa = document.createElement("div");
        colunaTarefa.className = "coluna"; // Adiciona uma classe para estilização
        colunaTarefa.Id = coluna.Id;
        colunaTarefa.innerHTML = `
            <div class="container-tarefas" id="tarefas-${coluna.Id}">
                <h3>${coluna.Name}</h3>
                <!-- Tarefas desta coluna serão adicionadas aqui -->
            </div>`;
        // Adicionando a coluna ao contêiner principal
        containerColunas.appendChild(colunaTarefa);
        carregarTarefasDaColuna(coluna.Id);
    });
}

// TAREFAS
async function carregarTarefasDaColuna(idColuna) {
    try {
        const infoTarefas = await fetch(`${url_tarefa}=${idColuna}`);
        const divTarefas = document.getElementById(`tarefas-${idColuna}`);
        if (infoTarefas.ok) {
            console.log(infoTarefas);
            const tarefasJson = await infoTarefas.json();
            console.log(infoTarefas);
            criarTarefas(tarefasJson, divTarefas);
        } else {
            console.error("Erro ao carregar tarefas:", infoTarefas.status);
        }      
    } catch (erro) {
        console.error("Erro"); // Exibe a mensagem de erro
    }
}

// FUNÇÃO QUE CRIA AS TAREFAS
function criarTarefas(tarefasJson, divTarefas) {
    // Limpa tarefas anteriores na coluna
    divTarefas.innerHTML = "";

    // Renderiza as tarefas recebidas
    tarefasJson.forEach((tarefa) => {
        const tarefaElemento = document.createElement("div");
        tarefaElemento.className = "tarefa";
        tarefaElemento.innerHTML = `
            <p><strong>${tarefa.Title}</strong></p>
            <p>${tarefa.Description}</p>
        `;
        divTarefas.appendChild(tarefaElemento);
    });
}
