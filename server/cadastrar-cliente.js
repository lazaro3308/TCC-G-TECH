
const conexao = require("./database/conexao");

// Dados do cliente
const cliente = {
    nome: "Cliente Teste",
    email: "cliente@teste.com",
    telefone: "38999999999",
    empresa: "Empresa Teste"
};

// Comando SQL para inserir os dados
const sql = `
    INSERT INTO clientes (nome, email, telefone, empresa)
    VALUES (?, ?, ?, ?)
`;

// Executar o cadastro
conexao.query(
    sql,
    [
        cliente.nome,
        cliente.email,
        cliente.telefone,
        cliente.empresa
    ],
    (erro, resultado) => {

        if (erro) {
            console.log("Erro ao cadastrar cliente:", erro.message);
            conexao.end();
            return;
        }

        console.log("Cliente cadastrado com sucesso!");
        console.log("ID do cliente:", resultado.insertId);

        conexao.end();
    }
);
