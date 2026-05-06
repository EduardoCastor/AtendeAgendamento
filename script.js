// ==========================
// 🔹 ELEMENTOS
// ==========================
const form = document.getElementById('formAtendeAgendamento');
const statusBox = document.getElementById('status');
const select = document.getElementById('protocoloSelect');
const statusSelect = document.getElementById('statusSelect');
const inputResposta = document.getElementById('resposta');

// 🔹 CACHE DOS ATENDIMENTOS
let listaAtendimentos = [];

// 🔹 Webhook para BUSCAR dados
const WEBHOOK_LISTA = 'https://n8n.srv1352561.hstgr.cloud/webhook/carregaprotocolo';

// 🔹 Webhook para ATUALIZAR status
const WEBHOOK_UPDATE = 'https://n8n.srv1352561.hstgr.cloud/webhook/atualizaatendimento';

// ==========================
// 🔹 CARREGAR DROPDOWN
// ==========================
async function carregarLista() {
  try {
    const response = await fetch(WEBHOOK_LISTA);

    if (!response.ok) throw new Error('Erro ao buscar dados');

    const data = await response.json();

    // 🔹 GUARDA OS DADOS COMPLETOS
    listaAtendimentos = data.slots || [];

    // 🔹 LIMPA SELECT
    select.innerHTML = '<option value="">Selecione um atendimento</option>';

    // 🔹 PREENCHE SELECT
    listaAtendimentos.forEach(item => {
      const option = document.createElement('option');
      option.value = item.value;
      option.textContent = item.label;
      select.appendChild(option);
    });

    // 🔹 LIMPA RESPOSTA AO RECARREGAR
    inputResposta.value = '';

  } catch (error) {
    console.error(error);
    select.innerHTML = '<option>Não há atendimentos pendentes</option>';
    inputResposta.value = '';
  }
}

// ==========================
// 🔹 ATUALIZA RESPOSTA AO TROCAR PROTOCOLO
// ==========================
select.addEventListener('change', () => {
  const protocoloSelecionado = select.value;

  const atendimento = listaAtendimentos.find(
    item => item.value === protocoloSelecionado
  );
  inputResposta.value = 'atendimento.resposta';
  //if (atendimento) {
  // inputResposta.value = atendimento.resposta || '';
  //} else {
 // inputResposta.value = '';
  }
});

// ==========================
// 🔹 SUBMIT
// ==========================
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const protocolo = select.value;
  const status = statusSelect.value;

  if (!protocolo || !status) {
    alert('Preencha todos os campos');
    return;
  }

  try {
    const response = await fetch(WEBHOOK_UPDATE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ protocolo, status })
    });

    if (!response.ok) throw new Error('Erro ao atualizar');

    statusBox.style.display = 'block';
    statusBox.innerHTML = '✅ Status atualizado com sucesso';

    // 🔹 RESET
    form.reset();
    inputResposta.value = '';

    // 🔹 RECARREGA LISTA
    carregarLista();

  } catch (error) {
    console.error(error);
    statusBox.style.display = 'block';
    statusBox.innerHTML = '❌ Erro ao atualizar';
  }
});

// ==========================
// 🔹 INIT
// ==========================
carregarLista();
