// Variáveis
let carrinho = [];
const listaCarrinho = document.getElementById('lista-carrinho');
const totalCarrinhoElemento = document.getElementById('total-carrinho');
const quantidadeItensCarrinhoElemento = document.getElementById('quantidade-itens-carrinho');
const botoesAdicionar = document.querySelectorAll('.botao-comprar');
const botaoLimparCarrinho = document.getElementById('limpar-carrinho');

// Variáveis para o Modal
const botaoFinalizarCompra = document.getElementById('finalizar-compra');
const modalConfirmacao = document.getElementById('modal-confirmacao');
const fecharModalBtn = document.querySelector('.fechar-modal');
const listaModalItens = document.getElementById('lista-modal-itens');
const totalModalElemento = document.getElementById('total-modal');
const btnConfirmar = document.getElementById('btn-confirmar');
const btnCancelar = document.getElementById('btn-cancelar');


// Funções
function atualizarCarrinhoUI() {
    listaCarrinho.innerHTML = '';
    let total = 0;

    carrinho.forEach((item, index) => {
        const li = document.createElement('li');
        const subtotalItem = item.preco * item.quantidade;
        total += subtotalItem;

        li.innerHTML = `
            <span>${item.nome}</span> 
            <div class="quantidade-controles">
                <button class="diminuir-quantidade" data-index="${index}">-</button>
                <span>x${item.quantidade}</span>
                <button class="aumentar-quantidade" data-index="${index}">+</button>
                <span>R$ ${subtotalItem.toFixed(2)}</span>
            </div>
            <button class="remover-item" data-index="${index}">Remover</button>
        `;
        listaCarrinho.appendChild(li);
    });

    totalCarrinhoElemento.textContent = total.toFixed(2);

    const quantidadeTotalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    quantidadeItensCarrinhoElemento.textContent = quantidadeTotalItens;

    // Se o carrinho estiver vazio, desabilita o botão de finalizar compra
    if (carrinho.length === 0) {
        botaoFinalizarCompra.disabled = true;
        botaoFinalizarCompra.style.opacity = '0.6';
        botaoFinalizarCompra.style.cursor = 'not-allowed';
    } else {
        botaoFinalizarCompra.disabled = false;
        botaoFinalizarCompra.style.opacity = '1';
        botaoFinalizarCompra.style.cursor = 'pointer';
    }
}

/**
 * Adiciona um produto ao carrinho.
 * @param {string} nome - O nome do produto.
 * @param {number} preco - O preço do produto.
 */
function adicionarAoCarrinho(nome, preco) {
    const itemExistente = carrinho.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }
    atualizarCarrinhoUI();
}

/**
 * Remove um item do carrinho pelo seu índice.
 * @param {number} index - O índice do item a ser removido no array 'carrinho'.
 */
function removerDoCarrinho(index) {
    if (index >= 0 && index < carrinho.length) {
        carrinho.splice(index, 1);
        atualizarCarrinhoUI();
    }
}

/**
 * Aumenta a quantidade de um item no carrinho.
 * @param {number} index - O índice do item no array 'carrinho'.
 */
function aumentarQuantidade(index) {
    if (index >= 0 && index < carrinho.length) {
        carrinho[index].quantidade++;
        atualizarCarrinhoUI();
    }
}

/**
 * Diminui a quantidade de um item no carrinho. Se a quantidade chegar a zero, remove o item.
 * @param {number} index - O índice do item no array 'carrinho'.
 */
function diminuirQuantidade(index) {
    if (index >= 0 && index < carrinho.length) {
        if (carrinho[index].quantidade > 1) {
            carrinho[index].quantidade--;
        } else {
            removerDoCarrinho(index);
            return;
        }
        atualizarCarrinhoUI();
    }
}

/**
 * Limpa todos os itens do carrinho.
 */
function limparCarrinho() {
    carrinho = [];
    atualizarCarrinhoUI();
    alert('Carrinho limpo!'); // Feedback para o usuário
}

/**
 * Abre o modal de confirmação, preenchendo-o com os itens do carrinho.
 */
function abrirModalConfirmacao() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio. Adicione itens antes de finalizar a compra!');
        return;
    }

    listaModalItens.innerHTML = ''; // Limpa a lista do modal
    let totalModal = 0;

    carrinho.forEach(item => {
        const li = document.createElement('li');
        const subtotalItem = item.preco * item.quantidade;
        totalModal += subtotalItem;
        li.innerHTML = `${item.nome} (x${item.quantidade}) <span>R$ ${subtotalItem.toFixed(2)}</span>`;
        listaModalItens.appendChild(li);
    });

    totalModalElemento.textContent = totalModal.toFixed(2);
    modalConfirmacao.style.display = 'flex'; // Exibe o modal
}

/**
 * Fecha o modal de confirmação.
 */
function fecharModalConfirmacao() {
    modalConfirmacao.style.display = 'none'; // Oculta o modal
}

/**
 * Lida com a confirmação da compra.
 */
function confirmarCompra() {
    alert('Compra finalizada com sucesso! Seus itens serão enviados em breve.');
    limparCarrinho(); // Limpa o carrinho após a confirmação
    fecharModalConfirmacao();
}

/**
 * Lida com o cancelamento da compra.
 */
function cancelarCompra() {
    alert('Compra cancelada. Você pode continuar adicionando ou removendo itens.');
    fecharModalConfirmacao();
}


// --- Eventos ---

// Eventos dos botões "Adicionar ao Carrinho"
botoesAdicionar.forEach(botao => {
    botao.addEventListener('click', (event) => {
        event.preventDefault();
        const nomeProduto = event.target.dataset.nomeProduto;
        const precoProduto = parseFloat(event.target.dataset.precoProduto);
        adicionarAoCarrinho(nomeProduto, precoProduto);
    });
});

// Evento do botão "Limpar Carrinho"
botaoLimparCarrinho.addEventListener('click', limparCarrinho);

// Evento do botão "Finalizar Compra"
botaoFinalizarCompra.addEventListener('click', abrirModalConfirmacao);

// Evento do botão "X" (fechar modal)
fecharModalBtn.addEventListener('click', fecharModalConfirmacao);

// Evento dos botões "Sim" e "Não" dentro do modal
btnConfirmar.addEventListener('click', confirmarCompra);
btnCancelar.addEventListener('click', cancelarCompra);

// Fecha o modal se o usuário clicar fora do conteúdo do modal
window.addEventListener('click', (event) => {
    if (event.target === modalConfirmacao) {
        fecharModalConfirmacao();
    }
});

// Evento para os botões de remover/aumentar/diminuir dentro da lista do carrinho
listaCarrinho.addEventListener('click', (event) => {
    if (event.target.classList.contains('remover-item')) {
        const index = parseInt(event.target.dataset.index);
        removerDoCarrinho(index);
    } else if (event.target.classList.contains('aumentar-quantidade')) {
        const index = parseInt(event.target.dataset.index);
        aumentarQuantidade(index);
    } else if (event.target.classList.contains('diminuir-quantidade')) {
        const index = parseInt(event.target.dataset.index);
        diminuirQuantidade(index);
    }
});

// Inicializa o carrinho ao carregar a página
atualizarCarrinhoUI();