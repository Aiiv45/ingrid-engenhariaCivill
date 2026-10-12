const formContato = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

formContato.addEventListener('submit', async (event) => {
    // 1. Impede a página de recarregar
    event.preventDefault(); 

    // 2. Coleta os valores do formulário
    const dadosFormulario = { 
        nome: document.getElementById('nome').value, 
        email: document.getElementById('email').value, 
        servico: document.getElementById('servico').value, 
        mensagem: document.getElementById('mensagem').value 
    };

    // 3. Mostra mensagem de "Enviando..." 
    formFeedback.style.color = '#555'; 
    formFeedback.textContent = 'Enviando sua mensagem...';
    
    try { 
        // 4. Envia para a sua API rodando no computador 
        const resposta = await fetch('https://ingrid-engenhariacivill.onrender.com/api/contato', { 
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json' 
            }, 
            body: JSON.stringify(dadosFormulario) 
        }); 
        
        const resultado = await resposta.json();
        
        // 5. Exibe a resposta na tela
        if (resposta.ok && resultado.sucesso) { 
            formFeedback.style.color = '#2e7d32';// Verde 
            formFeedback.textContent = '✅ ' + resultado.mensagem; 
            formContato.reset(); // Limpa os campos 
        } 
        else { 
            formFeedback.style.color = '#d32f2f'; // Vermelho
            formFeedback.textContent = '❌ ' + (resultado.erro || 'Erro ao enviar mensagem.');
        } 
    } catch (erro) { 
        console.error('Erro ao conectar com a API:', erro); 
        formFeedback.style.color = '#d32f2f'; 
        formFeedback.textContent = '❌ Não foi possível conectar ao servidor. Verifique se o servidor Node está ligado.'; 
    } 
});