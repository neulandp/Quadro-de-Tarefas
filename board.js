const url_theme = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/"
const url_quadros = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/ColumnByBoardId?BoardId"
const url_board = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Boards"
const url_task = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/TasksByColumnId?ColumnId"


//EXIBE O EMAIL NA NAV
const messageHello = document.getElementById("message-bemVindo");
var infoUsuario = localStorage.getItem("usuario")
var user = JSON.parse(infoUsuario)
var email = user.Email
messageHello.innerText = `${email}`;

//EVENTO QUE ATIVA MEU DARK MODE
const buttonDark = document.getElementById("button-darkmode");
buttonDark.addEventListener('change', () => {
  if (buttonDark.checked) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
});

// DROPDOWN
async function dropDown(){

    try{
        const listBoard = await fetch(url_board)  // Fazendo a requisição para obter os boards
       
        if(listBoard.ok){

            const selectBoard = document.getElementById("select-board");
            const boards = await listBoard.json()// Convertendo a resposta para JSON
            creatBoard(boards,selectBoard);
    }else{
            console.error("Erro", listBoard.status); // Exibe a mensagem de erro
        }
    }catch(error){
        console.log("Erro"); // Exibe a mensagem de erro
    }
}

function creatBoard(boards,selectBoard){
    boards.forEach(board => {
        const optionBoard = document.createElement("option")
        optionBoard.value = board.Id; // ID do quadro
        optionBoard.textContent = board.Name; // Nome do quadro
        selectBoard.appendChild(optionBoard);    
    })
        selectBoard.addEventListener("change", async (event) => {
            const selectedBoardId = event.target.value; // ID do quadro selecionado
            if(selectedBoardId){
            await loadBoard(selectedBoardId); // Carregar as colunas apenas para o quadro selecionado
        }        
})
}

document.addEventListener("DOMContentLoaded", dropDown);

// EVENTO COLUNAS
async function loadBoard(boardId) {

    try{
        const columnContainer = document.getElementById("column-container"); 
        const boardTitle = document.getElementById("board-title");
        const infoColumns = await fetch(`${url_quadros}=${boardId}`);  // Fazendo a requisição para obter as colunas
       
        columnContainer.innerHTML = ""; // Limpa as colunas anteriores
        if (infoColumns.ok) {
            const columns = await infoColumns.json();
            
/*Atualizar o título do quadro, se necessário - Supondo que a API retorne o nome do quadro 
          Caso contrário, ajuste conforme a resposta da API*/
            creatColumns(columns,columnContainer)
       
    } else {
        console.error("Erro ao carregar colunas:", infoColumns.status);
      }
    }catch(error){
        console.log("Erro"); // Exibe a mensagem de erro
    }
}

function creatColumns(columns,columnContainer){
    columns.forEach((column) => {
        const columnTask = document.createElement("div")
            columnTask.className = "column" // Adiciona uma classe para estilização
            columnTask.Id = column.Id
            columnTask.innerHTML = `
            <div class="tasks-container" id="tasks-${column.Id}">
                <h3>${column.Name}</h3>
                <!-- Tarefas desta coluna serão adicionadas aqui -->
            </div>`;
        // Adicionando a coluna ao contêiner principal
        columnContainer.appendChild(columnTask);
        taskColumn(column.Id)

    })
}

//TASK 
async function taskColumn(columnId) {

    try {
    const infoTask = await fetch(`${url_task}=${columnId}`);
    const divTask = document.getElementById(`task-${columnId}`);
        if(infoTask.ok){
            console.log(infoTask);
            const taskJson = await infoTask.json();
            console.log(infoTask);
            creatTask(taskJson,divTask);
        }else {
            console.error("Erro ao carregar colunas:", infoTask.status);
        }      
    } catch (error) {
        console.error("Erro"); // Exibe a mensagem de erro
  }
}

//FUNÇÃO QUE CRIA AS TASK
function creatTask(taskJson,divTask){

 // Limpa tarefas anteriores na coluna
 divTask.innerHTML = "";

 // Renderiza as tarefas recebidas
 taskJson.forEach((task) => {
     const taskElement = document.createElement("div");
     taskElement.className = "task";
     taskElement.innerHTML = `
         <p><strong>${task.Title}</strong></p>
         <p>${task.Description}</p>
     `;
     divTask.appendChild(taskElement);
 });
}