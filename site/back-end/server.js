const express = require('express');
const cors = require('cors');
// IMPORTAÇÃO DAS BIBLIOTECAS E GUARDA EM EM VARIAVEL CONSTANTE

const app = express();
// CRIAÇÃO DA APLICAÇÃO EXPRESS E GUARDAMOS ELA EM APP

app.use(cors()); // ATIVANDO O CORS
app.use(express.json()); // ENSINA O EXPRESS A INTERPRETAR O JSON E TRANSFORMA EM UM OBJETO JAVASCRIPT

app.post('/api/contato', async (req, res) => { // ".post()" METODO PARA AS REQUISIÇÕES POST; "async" MARCA A FUNÇÃO COMO ASSINCRONA; "req" GUARDA OS DADOS DO FRONT; "res" OBJETO UTILIZADO PARA RESPONDER O FRONT COM UM CODIGO STATUS HTTP E UM JSON DE CONFIRMAÇÃO

    try {
        const { nome, email, servico, mensagem } = req.body;
        // SALVAR DADOS
        console.log('Dados recebidos:', { nome, email, servico, mensagem });
        // CONFIRMAR QUE FORAM SALVOS
        return res.status(201).json({
            sucesso: true,
            mensagem: 'Formulário recebido com sucesso!' });
        // HTTP 201 : CREATED; JSON DE SUCESSO NO FORMULARIO
    } 
    catch (erro) {
        console.error('Erro no servidor:', erro);
        return res.status(500).json({
            sucesso: false, 
            erro: 'Erro interno no servidor.' });
            // HTTP 500 : INTERNAL SERVER ERROR; JSON DE ERRO
    }
});

const PORTA = 3000;

app.listen(PORTA, () => { // ".listen()" LIGA O SERVER E DEIXA PREPARADO PARA QUALQUER REQUISIÇÃO HTTP
  console.log(` Servidor rodando em http://localhost:${PORTA}`);
});