import {makeRequest} from './api.js'

const botaoModoEscuro = document.getElementById("botao-modo-escuro");
botaoModoEscuro.addEventListener('change', () => {
  if (botaoModoEscuro.checked) {
    document.body.classList.add('modo-escuro');
  } else {
    document.body.classList.remove('modo-escuro');
  }
});

function startLoading() {
    document.getElementById('loading').classList.remove('hide');
    document.getElementById('container-colunas').classList.add('hide')
}

function removeLoading() {
    document.getElementById('loading').classList.add('hide');
    document.getElementById('container-colunas').classList.remove('hide')
}

// DROPDOWN
async function carregarQuadros() {
    try {
        startLoading();
        const listaQuadros = await makeRequest('/Boards');
        
        if (listaQuadros.ok) {
            const quadros = await listaQuadros.json(); 
            criarQuadros(quadros, 'selecao-quadro-tarefa');
        } else {
            console.error("Erro", listaQuadros.status); 
        }
    } catch (erro) {
        console.log(erro); 
    } finally {
        removeLoading();
    }
}

function criarQuadros(quadros, selectQuadroId) {
    const selectQuadro = document.getElementById(selectQuadroId)  

    const quadrosHTML = quadros.map((quadro) => {
        return `
            <option value="${quadro.Id}">
                ${quadro.Name}
            </option> 
        `
    }).join('');

    selectQuadro.innerHTML = quadrosHTML;

    selectQuadro.addEventListener("change", async (evento) => {
        const idQuadroSelecionado = evento.target.value; 

        if (idQuadroSelecionado) {
            await carregarColunas(idQuadroSelecionado); 
        }        
    });
}

document.addEventListener("DOMContentLoaded", carregarQuadros);

// EVENTO COLUNAS
async function carregarColunas(idQuadro) {
    try {
        startLoading()
        const tituloQuadro = document.getElementById("titulo-quadro");
        const boardColumnsData = await makeRequest(`/ColumnByBoardId?BoardId=${idQuadro}`)
        
        if (boardColumnsData.ok) {
            const colunas = await boardColumnsData.json();
            // console.log(colunas);
            
            await criarColunas(colunas, "container-colunas");

        } else {
            console.error("Erro ao carregar colunas:", boardColumnsData.status);
        }
    } catch (erro) {
        console.log(erro); 
    } finally {
        removeLoading();
    }
}

async function criarColunas(colunas, containerColunasId) {
    const columnContainer = document.getElementById(containerColunasId)
    const columnStack = [];

    const containerContent =  colunas.map((col) => {
           columnStack.push(col.Id); 

            return `
                <div class="coluna" id="${col.Id}">
                    <div class="container-tarefas" id="tarefas-${col.Id}">
                        <h3>${col.Name ?? ''}</h3>

                    </div> 
                </div>
        `
    }).join('')

    columnContainer.innerHTML = containerContent;
    Promise.all(columnStack.map((id) => carregarTarefasDaColuna(id))); 
}

// TAREFAS
async function carregarTarefasDaColuna(idColuna) {
    try {
        startLoading();
        // const infoTarefas = await fetch(`${url_tarefa}=${idColuna}`);
        const infoTarefas = await makeRequest(`TasksByColumnId?ColumnId=${idColuna}`)
        if (infoTarefas.ok) {
            const tarefasJson = await infoTarefas.json();

            const tarefaHtml = criarTarefas(tarefasJson);
            document.getElementById(`tarefas-${idColuna}`).innerHTML = tarefaHtml

        } else {
            console.error("Erro ao carregar tarefas:", infoTarefas.status);

            return ''
        }      
    } catch (erro) {
        console.error(erro); 

        return ''
    } finally {
        removeLoading();
    }
}

function criarTarefas(tarefasJson) {
    return tarefasJson.map((tarefa) => {
        return `
           <div class="tarefa">
               <p><strong>${tarefa.Title ?? ''}</strong></p>
                <p>${tarefa.Description ?? ''}</p>         
           </div>  
        `
    }).join('')
}
