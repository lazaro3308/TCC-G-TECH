
const express = require("express");
const cors = require("cors");

// Importar conexão com MySQL
const conexao = require("./database/conexao");

const app = express();

app.use(cors());
app.use(express.json());

// ROTA 1: Receber chamados
app.post("/chamados", (req, res) => {

    const { empresa, email, problema } = req.body;

    console.log("Empresa:", empresa);
    console.log("Email:", email);
    console.log("Problema:", problema);

    res.status(201).json({
        mensagem: "Chamado recebido com sucesso!",
        chamado: {
            empresa,
            email,
            problema
        }
    });
});

// ROTA 2: Cadastrar clientes
app.post("/clientes", (req, res) => {

    // Receber os dados enviados
    const { nome, email, telefone, empresa } = req.body;

    // Verificar se os campos obrigatórios foram preenchidos
    if (!nome || !email) {
        return res.status(400).json({
            mensagem: "Nome e e-mail são obrigatórios."
        });
    }

    // Comando SQL
    const sql = `
        INSERT INTO clientes (nome, email, telefone, empresa)
        VALUES (?, ?, ?, ?)
    `;

    // Salvar no MySQL
    conexao.query(
        sql,
        [nome, email, telefone || null, empresa || null],
        (erro, resultado) => {

            if (erro) {
                console.log("Erro ao cadastrar:", erro.message);

                return res.status(500).json({
                    mensagem: "Não foi possível cadastrar o cliente."
                });
            }

            console.log("Cliente cadastrado:", nome);

            return res.status(201).json({
                mensagem: "Cliente cadastrado com sucesso!",
                cliente: {
                    id: resultado.insertId,
                    nome,
                    email,
                    telefone,
                    empresa
                }
            });
        }
    );
});

// Iniciar servidor
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
