require('dotenv').config(); // ativa o .env
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
        user: process.env.GMAIL_USER, // E-MAIL QUE VAI DISPARAR AS MENSAGENS
        pass: process.env.GMAIL_PASS // SENHA DE APLICATIVO GERADA PELO GOOGLE
    } 
});

app.post('/api/contato', async (req, res) => { // ".post()" METODO PARA AS REQUISIÇÕES POST; "async" MARCA A FUNÇÃO COMO ASSINCRONA; "req" GUARDA OS DADOS DO FRONT; "res" OBJETO UTILIZADO PARA RESPONDER O FRONT COM UM CODIGO STATUS HTTP E UM JSON DE CONFIRMAÇÃO

    try {
        const { nome, email, servico, mensagem } = req.body;

        // VALIDAÇÃO DE CAMPOS OBRIGATORIOS
        if (!nome || !nome.trim() ||  
            !email || !email.trim() || 
            !servico || !servico.trim() || !mensagem || !mensagem.trim()) { 
            return res.status(400).json({ 
                sucesso: false, 
                erro: 'Todos os campos (nome, e-mail, serviço e mensagem) devem ser preenchidos.'
            }); // HTTP 400: BAD REQUEST; JSON DE ERRO
        }

        // VALIDAÇÃO DO FORMATO DO E-MAIL POR EXPRESSÃO REGULAR
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email.trim())) {  // TESTE SE O EMAIL ESTA NO PADRÃO 
            return res.status(400).json({ 
                sucesso: false, 
                erro: 'Por favor, insira um endereço de e-mail válido.' 
            }); // HTTP 400: BAD REQUEST; JSON DE ERRO
        }
        
        // SALVAR DADOS EM VARIAVEIS LIMPAS SEM ESPAÇAMENTO(.TRIM() FAZ ESSE PAPEL)
        const nomeLimpo = nome.trim(); 
        const emailLimpo = email.trim(); 
        const servicoLimpo = servico.trim(); 
        const mensagemLimpa = mensagem.trim(); 
        console.log('Dados validados com sucesso:', { nomeLimpo, emailLimpo, servicoLimpo, mensagemLimpa });

        await transporter.sendMail({
            from: `"Novo formulário recebido!!" <${process.env.GMAIL_USER}>`,
            to: process.env.EMAIL_DE_DESTINO, // QUEM VAI RECEBER OS AVISOS
            replyTo: emailLimpo,                                 // E-MAIL DO CLIENTE QUE PREENCHEU O FORMULÁRIO
            subject: `🚨 Novo Orçamento: ${servicoLimpo}`,
            html: `
                <h2>Novo formulário recebido pelo site!</h2>
                <p><strong>Nome:</strong> ${nomeLimpo}</p>
                <p><strong>E-mail:</strong> ${emailLimpo}</p>
                <p><strong>Serviço Solicitado:</strong> ${servicoLimpo}</p>
                <p><strong>Mensagem:</strong> ${mensagemLimpa}</p>`
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

const PORTA = process.env.PORTA || 3000;

app.listen(PORTA, () => { // ".listen()" LIGA O SERVER E DEIXA PREPARADO PARA QUALQUER REQUISIÇÃO HTTP
  console.log(` Servidor rodando em http://localhost:${PORTA}`);
});