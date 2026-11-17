
const mysql = require("mysql2");

const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "g_tech_suporte"
});

conexao.connect((erro) => {
    if (erro) {
        console.log("Erro ao conectar ao MySQL:", erro.message);
        return;
    }

    console.log("MySQL conectado com sucesso!");
});

module.exports = conexao;
