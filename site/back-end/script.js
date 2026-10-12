// Envia o formulário de contato para o back-end sem recarregar a página,
// mostrando a mensagem de sucesso ou erro retornada pela API.

const form = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');

if (form) {
  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const dados = {
      nome: document.getElementById('nome').value,
      email: document.getElementById('email').value,
      servico: document.getElementById('servico').value,
      mensagem: document.getElementById('mensagem').value
    };

    const botao = form.querySelector('button[type="submit"]');
    botao.disabled = true;
    feedback.textContent = 'Enviando...';
    feedback.className = 'form-feedback';

    try {
      const resposta = await fetch('https://pascoaleng.com.br/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      const resultado = await resposta.json();

      if (resultado.sucesso) {
        feedback.textContent = resultado.mensagem;
        feedback.className = 'form-feedback success';
        form.reset();
      } else {
        feedback.textContent = resultado.erro;
        feedback.className = 'form-feedback error';
      }
    } catch (erro) {
      feedback.textContent = 'Não foi possível enviar sua mensagem. Tente novamente ou chame no WhatsApp.';
      feedback.className = 'form-feedback error';
    } finally {
      botao.disabled = false;
    }
  });
}
