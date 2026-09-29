const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
// IMPORTAÇÃO DAS BIBLIOTECAS E GUARDA EM EM VARIAVEL CONSTANTE

const app = express();
// CRIAÇÃO DA APLICAÇÃO EXPRESS E GUARDAMOS ELA EM APP

app.use(cors()); // ATIVANDO O CORS
app.use(express.json()); // ENSINA O EXPRESS A INTERPRETAR O JSON E TRANSFORMA EM UM OBJETO JAVASCRIPT

const transporter = nodemailer.createTransport({ 
    service: 'gmail', 
    auth: { 
        user: '', // O e-mail que vai disparar as mensagens 
        pass: '' // Senha de aplicativo gerada no Google 
    } 
});

app.post('/api/contato', async (req, res) => { // ".post()" METODO PARA AS REQUISIÇÕES POST; "async" MARCA A FUNÇÃO COMO ASSINCRONA; "req" GUARDA OS DADOS DO FRONT; "res" OBJETO UTILIZADO PARA RESPONDER O FRONT COM UM CODIGO STATUS HTTP E UM JSON DE CONFIRMAÇÃO

    try {
        const { nome, email, servico, mensagem } = req.body;
        // SALVAR DADOS
        console.log('Dados recebidos:', { nome, email, servico, mensagem });
        await transporter.sendMail({
            from: '"Novo formulário recebido!!" <seuemail@gmail.com>',
            to: '', // Quem vai receber os avisos
            replyTo: email,                                 // E-mail do cliente que preencheu o formulário
            subject: `🚨 Novo Orçamento: ${servico}`,
            html: `
                <h2>Novo formulário recebido pelo site!</h2>
                <p><strong>Nome:</strong> ${nome}</p>
                <p><strong>E-mail:</strong> ${email}</p>
                <p><strong>Serviço Solicitado:</strong> ${servico}</p>
                <p><strong>Mensagem:</strong> ${mensagem}</p>`
    });
        // CONFIRMAR QUE FORAM SALVOS
        return res.status(201).json({
            sucesso: true,
            mensagem: 'Formulário recebido com sucesso!' });
        // HTTP 201 : CREATED; JSON DE SUCESSO NO FORMULARIO
    } 
    catch (erro) {
        console.error('Erro ao enviar o e-mail:', erro);
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