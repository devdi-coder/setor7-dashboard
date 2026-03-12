// Configurações de caminhos para os recursos.
const PATHS = {
    portraitCapitao: 'portraits/capitao.png',
    somClick: 'sounds/click.mp3',
    somConfirm: 'sounds/confirm.mp3',
    somAlerta: 'sounds/open-modal.mp3'
};

const TREINAMENTOS = [
    "COMBATE URBANO NO RIO DE JANEIRO",
    "INFILTRAÇÃO NO SETOR 7",
    "MANUSEIO DE ARMAMENTO PESADO",
    "SOBREVIVÊNCIA EM ZONAS VERMELHAS",
    "PILOTAGEM DE DRONES",
    "TÁTICAS DE GUERRA PSICOLÓGICA",
    "DESCRIPTOGRAFIA DE DADOS",
    "PROGRAMAR... QUE?",
    "TREINAMENTO DE HACKING",
    "SIMULAÇÃO DE BATALHA VIRTUAL",
    "RESISTÊNCIA A TORTURA DIGITAL",
];

// Seleção de elementos DOM para manipulação.
const btnIniciar = document.getElementById('add-btn');
const inputSoldado = document.getElementById('soldier-input');
const modal = document.getElementById('confirmation-modal');
const modalText = document.getElementById('modal-text');
const portraitContainer = document.getElementById('portrait-container');
const btnConfirmarModal = document.getElementById('confirm-modal-btn');
const btnCancelarModal = document.getElementById('cancel-modal-btn');
const listaSoldados = document.getElementById('soldier-list');

// Variáveis para controle de fluxo.
let soldadoTemporario = "";
let modoAtual = "ENVIO"; 

// Carregamentos dos dados para inicialização.
document.addEventListener('DOMContentLoaded', () => {
    const dadosSalvos = JSON.parse(localStorage.getItem('setor7_unidades')) || [];
    dadosSalvos.forEach(unidade => {
        renderizarSoldado(unidade.nome, unidade.concluido);
    });
    atualizarContadores();
});

function playSound(src) {
    const audio = new Audio(src);
    audio.volume = 0.5;
    audio.play();
}

// Salvando os dados no localStorage para persistencia.
function salvarNoStorage() {
    const unidades = [];
    document.querySelectorAll('#soldier-list li').forEach(li => {
        unidades.push({
            nome: li.querySelector('.unit-name').innerText.replace('> UNIDADE: ', ''),
            concluido: li.classList.contains('completed-unit')
        });
    });
    localStorage.setItem('setor7_unidades', JSON.stringify(unidades));
}

// Lógica para o botão de confirmação do modal (envio ou conclusão).
btnConfirmarModal.addEventListener('click', () => {
    if (modoAtual === "ENVIO") {
        renderizarSoldado(soldadoTemporario, false);
        playSound(PATHS.somConfirm);
        salvarNoStorage(); 
    } 
    fecharModal();
    atualizarContadores();
});

function fecharModal() {
    modal.classList.add('hidden');
    inputSoldado.value = "";
    btnConfirmarModal.innerText = "CONFIRMAR";
    btnCancelarModal.classList.remove('hidden');
}

btnCancelarModal.addEventListener('click', fecharModal);

// Lógica para o botão de iniciar.
btnIniciar.addEventListener('click', () => {
    const valorInput = inputSoldado.value.trim();
    const apenasLetras = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;

    if (valorInput === "" || !apenasLetras.test(valorInput) || valorInput.length > 12) {
        alert("SISTEMA: IDENTIFICAÇÃO INVÁLIDA.");
        return;
    }

    modoAtual = "ENVIO";
    soldadoTemporario = valorInput;

    const treinoSorteado = TREINAMENTOS[Math.floor(Math.random() * TREINAMENTOS.length)];

    portraitContainer.innerHTML = `<img src="${PATHS.portraitCapitao}" alt="Capitão">`;
    modalText.innerHTML = 
        `<p>ATENÇÃO, RECRUTA.</p>
        <p>ENVIAR <strong>${soldadoTemporario.toUpperCase()}</strong> PARA:</p>
        <p style="color: #fff; text-shadow: 0 0 5px #00ff41;">> ${treinoSorteado}</p>
        <p>CONFIRMA O PROTOCOLO?</p>`;

    playSound(PATHS.somAlerta);
    modal.classList.remove('hidden');
});

// Função para renderizar o soldado na lista, com opções de concluir ou eliminar.
function renderizarSoldado(nome, concluido) {
    const li = document.createElement('li');
    if (concluido) li.classList.add('completed-unit');

    li.innerHTML = `
        <span class="unit-name">> UNIDADE: ${nome.toUpperCase()}</span>
        ${!concluido ? `
        <div class="actions">
            <button class="btn-action btn-check" title="Concluir">V</button>
            <button class="btn-action btn-del" title="Eliminar">X</button>
        </div>` : ''}
    `;

    if (!concluido) {
        const btnCheck = li.querySelector('.btn-check');
        const btnDel = li.querySelector('.btn-del');

        btnCheck.addEventListener('click', () => {
            modoAtual = "CONCLUSAO";
            abrirModalConclusao(nome);
            li.classList.add('completed-unit');
            li.querySelector('.actions').remove();
            salvarNoStorage(); 
            atualizarContadores();
        });

        btnDel.addEventListener('click', () => {
            playSound(PATHS.somClick);
            li.remove();
            salvarNoStorage(); 
            atualizarContadores();
        });
    }

    listaSoldados.appendChild(li);
}

// Função para abrir o modal de conclusão, com mensagem personalizada.
function abrirModalConclusao(nome) {
    portraitContainer.innerHTML = `<img src="${PATHS.portraitCapitao}" alt="Capitão">`;
    modalText.innerHTML = `<p>EXCELENTE TRABALHO, RECRUTA.</p><p>A UNIDADE <strong>${nome.toUpperCase()}</strong> <br>ESTÁ PRONTA PARA O PIOR.</p>`;
    btnConfirmarModal.innerText = "ENTENDIDO";
    btnCancelarModal.classList.add('hidden');
    playSound(PATHS.somConfirm);
    modal.classList.remove('hidden');
}

// Função para atualizar os contadores de unidades (total, ativas e concluídas).
function atualizarContadores() {
    const total = listaSoldados.children.length;
    const concluidos = document.querySelectorAll('.completed-unit').length;
    document.getElementById('total-count').innerText = total;
    document.getElementById('active-count').innerText = total - concluidos;
    document.getElementById('completed-count').innerText = concluidos;
}