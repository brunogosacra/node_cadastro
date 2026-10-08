const form = document.querySelector('#formulario');
const mensagem = document.querySelector('#mensagem');
const lista = document.querySelector('#lista');

function mostrarMensagem(texto, sucesso) {
  mensagem.textContent = texto;
  mensagem.className = sucesso ? 'sucesso' : 'erro';
}

async function carregarUsuarios() {
  try {
    const resposta = await fetch('/usuarios');
    if (!resposta.ok) throw new Error();
    const usuarios = await resposta.json();

    lista.innerHTML = '';
    usuarios.forEach(u => {
      const li = document.createElement('li');
      li.textContent = `${u.nome} — ${u.email}`; // textContent evita XSS
      lista.appendChild(li);
    });
  } catch {
    mostrarMensagem('Não foi possível carregar a lista.', false);
  }
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const nome = document.querySelector('#nome').value.trim();
  const email = document.querySelector('#email').value.trim();

  try {
    const resposta = await fetch('/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email })
    });
    const dados = await resposta.json().catch(() => ({}));

    if (resposta.ok) {
      mostrarMensagem('Cadastro realizado!', true);
      form.reset();
      carregarUsuarios();
    } else {
      mostrarMensagem(dados.erro || 'Erro ao cadastrar.', false);
    }
  } catch {
    mostrarMensagem('Sem conexão com o servidor.', false);
  }
});

carregarUsuarios();